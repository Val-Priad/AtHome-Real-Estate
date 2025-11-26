CREATE EXTENSION pg_cron;

CREATE OR REPLACE FUNCTION update_estate_statuses()
    RETURNS void AS $$
BEGIN
    UPDATE estate
    SET status = 'Expired',
        updated_at = NOW()
    WHERE expires_at < NOW()
      AND status != 'Expired';

    UPDATE estate
    SET status = 'Expiring',
        updated_at = NOW()
    WHERE expires_at >= NOW()
      AND expires_at <= NOW() + INTERVAL '7 days'
      AND status != 'Expiring';
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule(
               'update-estate-statuses-daily',
               '0 3 * * *',
               $$SELECT update_estate_statuses();$$
       );
