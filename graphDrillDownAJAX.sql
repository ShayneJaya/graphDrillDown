DECLARE
    -- retrieve the primary key value from the ajax request (passed in x01)
    l_PK varchar2(1000) := APEX_APPLICATION.G_X01;
    -- variable to store the final redirect url
    l_url VARCHAR2(32767);
    -- define the base url of the oracle apex instance (modify as needed)
    l_host varchar2(400) := 'https://<host>.adb.us-ashburn-1.oraclecloudapps.com'; 
    -- format: https://<guid>-<adb-name>.adb.<region>.oraclecloudapps.com
    -- define the target page number for redirection
    l_page_number number := null; -- CHANGE PAGE NUMBER. Ex:2
    -- define the page item that will receive the primary key value on target page
    l_page_item varchar(100) := null; --CHANGE PAGE ITEM. Ex: 'P2_EMPLOYEE_ID'
BEGIN
    -- generate the apex-friendly url with session-based checksum
    l_url := APEX_UTIL.PREPARE_URL(
        p_url            => 'f?p=&APP_ID.:' || l_page_number || ':&APP_SESSION.::NO::' || l_page_item || ':' || l_PK,
        p_checksum_type  => 'SESSION' -- ensures security by generating a session-based checksum
    );
    -- prepend the host url to form the complete redirect url
    l_url := l_host || l_url;
    -- return the generated url as a json response
    apex_json.open_object;
    apex_json.write('url', l_url);
    apex_json.close_object;

EXCEPTION 
    -- handle any unexpected errors and return an error message in json format
    WHEN OTHERS THEN
        apex_debug.message('Error! ' || SQLERRM); -- log error for debugging
        apex_json.open_object;
        apex_json.write('error', 'an error occurred: ' || SQLERRM);
        apex_json.close_object;
END;
