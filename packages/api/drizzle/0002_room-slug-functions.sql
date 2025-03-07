-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS "unaccent";

CREATE OR REPLACE FUNCTION slugify("value" TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(
           regexp_replace(
             lower(unaccent("value")), -- Lowercase and remove accents in one step
             '[^a-z0-9\\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
           ),
           '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
         );
END
$$ LANGUAGE plpgsql STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION public.set_slug_from_name() RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate the initial slug based on the 'name' field
    base_slug := slugify(NEW.name);
    final_slug := base_slug;

    -- Loop to ensure uniqueness of the slug
    LOOP
        -- Check if the slug already exists in the table
        IF EXISTS (SELECT 1 FROM "rooms" WHERE slug = final_slug AND NOT id = NEW.id) THEN
            -- If it exists, append a numeric suffix and increment the counter
            final_slug := base_slug || '-' || counter;
            counter := counter + 1;
        ELSE
            -- If it's unique, exit the loop
            EXIT;
        END IF;
    END LOOP;

    -- Set the unique slug to the 'slug' field of the NEW record
    NEW.slug := final_slug;
    RETURN NEW;
END
$$;


CREATE TRIGGER set_slug_from_name
BEFORE INSERT OR UPDATE
ON "rooms"
FOR EACH ROW
EXECUTE FUNCTION public.set_slug_from_name();