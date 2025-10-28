-- ==========================
-- ENUMS
-- ==========================

CREATE TYPE OPERATION_TYPE_ENUM AS ENUM ('Sale', 'Lease');
CREATE TYPE CURRENCY_ENUM AS ENUM ('USD', 'EUR');
CREATE TYPE PRICE_UNIT_ENUM AS ENUM ( 'per_property', 'per_month', 'per_night', 'per_m2', 'per_m2_per_month', 'per_m2_per_day' );
CREATE TYPE ESTATE_CATEGORY_ENUM AS ENUM ('Apartment', 'House');
CREATE TYPE BUILDING_CONDITION_ENUM AS ENUM ('Very good', 'Good', 'Poor', 'Under construction', 'Project', 'New building', 'For demolition', 'Before reconstruction', 'After reconstruction', 'Under reconstruction' );
CREATE TYPE BUILDING_TYPE_ENUM AS ENUM ('Panel', 'Brick', 'Other');
CREATE TYPE VICINITY_TYPE_ENUM AS ENUM ('Bus stop', 'Train station', 'Post office', 'ATM', 'General practitioner', 'Veterinarian', 'Primary school', 'Kindergarten', 'Supermarket', 'Small shop', 'Restaurant / Pub', 'Children''s playground', 'Metro' );
CREATE TYPE USER_ROLE_ENUM AS ENUM ('admin', 'agent', 'user');
CREATE TYPE MEDIA_TYPE_ENUM AS ENUM ('image', 'video', 'pdf', 'photo_360', 'document', 'floor plan');
CREATE TYPE ADVERT_SUBTYPE_ENUM AS ENUM ('1 studio', '1+1', '2 studio', '2+1', '3 studio', '3+1', '4 studio', '4+1', '5 studio', '5+1', '6 or more', 'Atypical', 'Room');
CREATE TYPE ADVERT_ROOM_COUNT_ENUM AS ENUM ('1','2','3','4','5+','Atypical');
CREATE TYPE FLAT_CLASS_ENUM AS ENUM ('Maisonette', 'Loft', 'Attic', 'Single-story');
CREATE TYPE WATER_HEAT_SOURCE_ENUM AS ENUM ('Electric boiler', 'Gas boiler', 'Flow heater', 'Solar collector', 'Other' );
CREATE TYPE HEATING_SOURCE_ENUM AS ENUM ( 'Gas boiler', 'Electric boiler', 'Central heating', 'Fireplace', 'Heat pump', 'Other' );
CREATE TYPE HEATING_ELEMENT_ENUM AS ENUM ( 'Radiator', 'Underfloor heating', 'Stove with water circuit', 'Heat pump', 'Other' );
CREATE TYPE WATER_ENUM AS ENUM ('Hot water', 'Cold water', 'Well', 'Other');
CREATE TYPE ELECTRICITY_ENUM AS ENUM ('120V','220V','230V', '380V', '400V', 'Other');
CREATE TYPE ROAD_TYPE_ENUM AS ENUM ('Asphalt', 'Gravel', 'No access road');
CREATE TYPE TELECOMMUNICATION_ENUM AS ENUM ('Telephone', 'Internet', 'Satellite');
CREATE TYPE FURNISHED_ENUM AS ENUM ('Yes', 'No', 'Partially');
CREATE TYPE INTERNET_CONNECTION_ENUM AS ENUM ( 'None', 'Fiber', 'DSL', 'Cable', 'Satellite', 'Mobile 4G', 'Mobile 5G', 'Other' );
CREATE TYPE PHASE_ENUM AS ENUM ('Single-phase','Three-phase');
CREATE TYPE CIRCUIT_BREAKER_ENUM AS ENUM ('20A','25A','32A','Other');

-- ==========================
-- USERS / BROKERS
-- ==========================

CREATE TABLE profile
(
    id           SERIAL PRIMARY KEY,
    role         USER_ROLE_ENUM NOT NULL,
    first_name   TEXT           NOT NULL,
    last_name    TEXT           NOT NULL,
    phone_number TEXT,
    description  TEXT,
    photo_url    TEXT,
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    CONSTRAINT phone_number_format_check CHECK (phone_number IS NULL OR
                                                phone_number ~
                                                '^\+[1-9]\d{7,14}$')
);
CREATE TABLE user_auth
(
    user_id       INT PRIMARY KEY REFERENCES profile (id) ON DELETE CASCADE,
    email         TEXT      NOT NULL UNIQUE,
    password_hash TEXT      NOT NULL,
    is_verified   BOOL      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================
-- ESTATE
-- ==========================

CREATE TABLE estate
(
    id                       SERIAL PRIMARY KEY,
    seller_id                INT                     REFERENCES profile (id) ON DELETE SET NULL,
    operation_type           OPERATION_TYPE_ENUM     NOT NULL,
    category                 ESTATE_CATEGORY_ENUM    NOT NULL,
    price                    NUMERIC(10, 2)          NOT NULL CHECK (price > 0),
    currency                 CURRENCY_ENUM           NOT NULL,
    price_unit               PRICE_UNIT_ENUM         NOT NULL,
    city                     TEXT                    NOT NULL,
    street                   TEXT                    NOT NULL,
    region_code              TEXT                    NOT NULL CHECK (region_code <> ''),
    latitude                 DOUBLE PRECISION        NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude                DOUBLE PRECISION        NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    building_condition       BUILDING_CONDITION_ENUM NOT NULL,
    usable_area              INT CHECK (usable_area >= 0),
    total_floor_area         INT CHECK (total_floor_area >= 0),
    ready_date               DATE,
    cost_of_living           NUMERIC(10, 2) CHECK (cost_of_living >= 0),
    commission               NUMERIC(10, 2) CHECK (commission >= 0),
    refundable_deposit       NUMERIC(10, 2) CHECK (refundable_deposit >= 0),
    commission_paid_by_owner BOOL                             DEFAULT FALSE,
    advert_lifetime          INT                     NOT NULL CHECK (advert_lifetime IN
                                                                     (7, 14,
                                                                      30, 45,
                                                                      90, 180,
                                                                      360)),
    expires_at               TIMESTAMP               NOT NULL,
    road_type                ROAD_TYPE_ENUM          NOT NULL,
    furnished                FURNISHED_ENUM          NOT NULL,
    easy_access              BOOL                    NOT NULL DEFAULT FALSE,
    created_at               TIMESTAMP               NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP               NOT NULL DEFAULT NOW()
);

-- ==========================
-- Apartment
-- ==========================
CREATE TABLE estate_apartment
(
    estate_id        INT PRIMARY KEY REFERENCES estate (id) ON DELETE CASCADE,
    balcony          BOOL NOT NULL DEFAULT FALSE,
    loggia           BOOL NOT NULL DEFAULT FALSE,
    terrace          BOOL NOT NULL DEFAULT FALSE,
    floor_number     INT CHECK (floor_number >= 0),
    apartment_number TEXT CHECK (apartment_number <> ''),
    balcony_area     INT CHECK (balcony_area >= 0),
    loggia_area      INT CHECK (loggia_area >= 0),
    terrace_area     INT CHECK (terrace_area >= 0),
    flat_class       FLAT_CLASS_ENUM,
    building_type    BUILDING_TYPE_ENUM,
    advert_subtype   ADVERT_SUBTYPE_ENUM
);

-- ==========================
-- Дом (House)
-- ==========================
CREATE TABLE estate_house
(
    estate_id           INT PRIMARY KEY REFERENCES estate (id) ON DELETE CASCADE,
    pool                BOOL NOT NULL DEFAULT FALSE,
    floors              INT CHECK (floors >= 0),
    garden_area         INT CHECK (garden_area >= 0),
    building_area       INT CHECK (building_area >= 0),
    cellar              BOOL NOT NULL DEFAULT FALSE,
    garage              BOOL NOT NULL DEFAULT FALSE,
    parking_lots_count  INT CHECK (parking_lots_count >= 0),
    underground_floors  INT CHECK (underground_floors >= 0),
    acceptance_year     INT CHECK (acceptance_year BETWEEN 1900 AND DATE_PART('year', NOW()) + 5),
    reconstruction_year INT CHECK (reconstruction_year BETWEEN 1900 AND DATE_PART('year', NOW()) + 5),
    pv_panels           BOOL NOT NULL DEFAULT FALSE,
    solar_water_heating BOOL NOT NULL DEFAULT FALSE,
    room_count          ADVERT_ROOM_COUNT_ENUM,
    circuit_breaker     CIRCUIT_BREAKER_ENUM,
    phase               PHASE_ENUM
);


CREATE TABLE estate_translation
(
    estate_id   INT REFERENCES estate (id) ON DELETE CASCADE,
    lang_code   TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (estate_id, lang_code)
);

-- ==========================
-- MEDIA
-- ==========================

CREATE TABLE estate_media
(
    id         SERIAL PRIMARY KEY,
    estate_id  INT             NOT NULL REFERENCES estate (id) ON DELETE CASCADE,
    url        TEXT            NOT NULL,
    media_type MEDIA_TYPE_ENUM NOT NULL,
    alt        TEXT,
    is_main    BOOL      DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================
-- WISH LIST
-- ==========================

CREATE TABLE wish_list
(
    user_id   INT REFERENCES profile (id) ON DELETE CASCADE,
    estate_id INT REFERENCES estate (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, estate_id)
);

-- ==========================
-- VICINITY
-- ==========================

CREATE TABLE estate_vicinity
(
    id         SERIAL PRIMARY KEY,
    estate_id  INT                NOT NULL REFERENCES estate (id) ON DELETE CASCADE,
    type       VICINITY_TYPE_ENUM NOT NULL,
    name       TEXT               NOT NULL,
    latitude   DOUBLE PRECISION   NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude  DOUBLE PRECISION   NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    distance_m INT                NOT NULL CHECK (distance_m >= 0 AND distance_m <= 10000)
);

CREATE INDEX estate_vicinity_distance_idx
    ON estate_vicinity (estate_id, distance_m);

-- ==========================
-- MULTISELECT LINK TABLES
-- ==========================

CREATE TABLE estate_heating_source
(
    estate_id      INT                 NOT NULL REFERENCES estate (id) ON DELETE CASCADE,
    heating_source HEATING_SOURCE_ENUM NOT NULL,
    PRIMARY KEY (estate_id, heating_source)
);


CREATE TABLE estate_heating_element
(
    estate_id       INT                  NOT NULL REFERENCES estate (id) ON DELETE CASCADE,
    heating_element HEATING_ELEMENT_ENUM NOT NULL,
    PRIMARY KEY (estate_id, heating_element)
);


CREATE TABLE estate_water_heating
(
    estate_id         INT                    NOT NULL REFERENCES estate (id) ON DELETE CASCADE,
    water_heat_source WATER_HEAT_SOURCE_ENUM NOT NULL,
    PRIMARY KEY (estate_id, water_heat_source)
);

CREATE TABLE estate_water
(
    estate_id INT REFERENCES estate (id) ON DELETE CASCADE,
    water     WATER_ENUM NOT NULL,
    PRIMARY KEY (estate_id, water)
);

CREATE TABLE estate_electricity
(
    estate_id   INT REFERENCES estate (id) ON DELETE CASCADE,
    electricity ELECTRICITY_ENUM NOT NULL,
    PRIMARY KEY (estate_id, electricity)
);

CREATE TABLE estate_telecommunication
(
    estate_id         INT REFERENCES estate (id) ON DELETE CASCADE,
    telecommunication TELECOMMUNICATION_ENUM NOT NULL,
    PRIMARY KEY (estate_id, telecommunication)
);

CREATE TABLE estate_internet
(
    estate_id       INT REFERENCES estate (id) ON DELETE CASCADE,
    connection_type INTERNET_CONNECTION_ENUM NOT NULL,
    PRIMARY KEY (estate_id, connection_type)
);


CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    new.updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profile_set_updated_at
    BEFORE UPDATE
    ON profile
    FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE OR REPLACE FUNCTION set_estate_expiration()
    RETURNS TRIGGER AS
$$
BEGIN
    IF tg_op = 'INSERT' THEN
        IF new.advert_lifetime IS NOT NULL THEN
            new.expires_at :=
                    NOW() + (new.advert_lifetime || ' days')::INTERVAL;
        END IF;
    ELSIF tg_op = 'UPDATE' THEN
        IF new.advert_lifetime IS DISTINCT FROM old.advert_lifetime THEN
            new.expires_at :=
                    NOW() + (new.advert_lifetime || ' days')::INTERVAL;
        END IF;
        new.updated_at := NOW();
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER estate_set_expiration
    BEFORE INSERT OR UPDATE
    ON estate
    FOR EACH ROW
EXECUTE FUNCTION set_estate_expiration();
