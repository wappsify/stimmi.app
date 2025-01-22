-- Custom SQL migration file, put your code below! --

-- Create a function to notify listeners
CREATE OR REPLACE FUNCTION notify_changes() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  payload = json_build_object(
    'table', TG_TABLE_NAME,
    'operation', TG_OP,
    'data', row_to_json(NEW)
  );
  PERFORM pg_notify('table_changes', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for INSERT, UPDATE, DELETE operations on results table
CREATE TRIGGER notify_changes_trigger_results
AFTER INSERT OR UPDATE OR DELETE ON results
FOR EACH ROW EXECUTE FUNCTION notify_changes();

-- Create a trigger for INSERT, UPDATE, DELETE operations on room_users table
CREATE TRIGGER notify_changes_trigger_room_users
AFTER INSERT OR UPDATE OR DELETE ON room_users
FOR EACH ROW EXECUTE FUNCTION notify_changes();

-- Create a trigger for INSERT, UPDATE, DELETE operations on room table
CREATE TRIGGER notify_changes_trigger_room
AFTER INSERT OR UPDATE OR DELETE ON room
FOR EACH ROW EXECUTE FUNCTION notify_changes();