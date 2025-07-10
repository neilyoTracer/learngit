1. [Select]
```SQL
SELECT DISTINCT column_list
FROM table_list
JOIN table ON join_condition
WHERE row_filter
ORDER BY column
LIMIT count OFFSET offset
GROUP BY column
HAVING group_filter;

# examples:
SELECT trackid, name, composer, unitprice FROM tracks;
SELECT * FROM tracks;
```

2. [ORDER] [BY]
```SQL
SELECT 
    select_list 
FROM 
    table 
ORDER BY 
    column_1 ASC, 
    column_2 DESC

# examples:

SELECT 
    Name,
    Milliseconds,
    AlbumId
FROM
    tracks;

SELECT 
    name,
    milliseconds,
    albumid
FROM
    tracks
ORDER BY
    albumid ASC;

SELECT 
    name,
    milliseconds,
    albumid
FROM
    tracks
ORDER BY
    albumid ASC;
    milliseconds DESC;    

SELECT 
    name,
    milliseconds,
    albumid
FROM
    tracks
ORDER BY
    3,     #albumid(3rd column)
    2;      

SELECT 
    TrackId, 
    Name, 
    Composer 
FROM 
   tracks
ORDER BY 
   Composer NULLS LAST; 
```

3. [DISTINCT]
```SQL
SELECT DISTINCT select_list
FROM table

SELECT DISTINCT city 
FROM customers
ORDER BY city;
```   

4. [WHERE]
```SQL
SELECT
    name,
    milliseconds,
    bytes,
    albumid
FROM
    tracks
WHERE
    albumid = 1;


SELECT
    name,
    milliseconds,
    bytes,
    albumid
FROM
    tracks
WHERE
    albumid = 1 AND milliseconds > 250000;


SELECT
    name,
    milliseconds,
    bytes,
    albumid
FROM
    tracks
WHERE
    composer LIKE '%Smith%'
ORDER BY
    albumid;

SELECT
	name,
	albumid,
	mediatypeid
FROM
	tracks
WHERE
	mediatypeid IN (2, 3);

SELECT
    BillingAddress,
    BillingCity,
    Total
FROM
    invoices
WHERE
    BillingCity = 'New York' AND Total > 5
ORDER BY
    Total;

SELECT
    BillingAddress,
    BillingCity,
    Total
FROM
    invoices
WHERE
    Total > 5 AND (BillingCity = 'New York' OR BillingCity = 'Chicago')
ORDER BY
    Total;    

SELECT
    BillingAddress,
    BillingCity,
    Total
FROM
    invoices
WHERE
    BillingCity = 'New York' OR BillingCity = 'Chicago'
ORDER BY 
    BillingCity;  

SELECT
    InvoiceId,
    BillingAddress,
    Total
FROM
    invoices
WHERE
    Total BETWEEN 14.91 and 18.86
ORDER BY
    Total;

SELECT
    InvoiceId,
    BillingAddress,
    Total
FROM
    invoices
WHERE
    Total NOT BETWEEN 1 and 20
ORDER BY
    Total;

SELECT
	TrackId,
	Name,
	Mediatypeid
FROM
	Tracks
WHERE
    MediaTypeId IN (1,2)
ORDER BY
    Name ASC;

SELECT
	TrackId,
	Name,
	MediaTypeId
FROM
	Tracks
WHERE
    MediaTypeId = 1 OR MediaTypeId = 2
ORDER BY 
    Name ASC;

SELECT
	TrackId, 
	Name, 
	AlbumId
FROM
	Tracks
WHERE
    AlbumId IN (
        SELECT
			AlbumId
		FROM
			Albums
		WHERE
			ArtistId = 12
    );

SELECT
	trackid,
	name,
	genreid
FROM
	tracks
WHERE
    genreid NOT IN (1,2,3);        
```

5. [LIMIT]
```SQL
SELECT
    trackid,
    name,
    bytes
FROM
    tracks
ORDER BY
    bytes DESC
LIMIT 10 OFFSET 10;
```

6. [LIKE]
```SQL
SELECT
    trackid,
    name
FROM
    tracks
WHERE
    name LIKE 'Wild%'；

SELECT
	trackid,
	name
FROM
	tracks
WHERE
	name LIKE '%Br_wn%';

SELECT c 
FROM t 
WHERE c LIKE '%10\%%' ESCAPE '\';
```

7. [GLOB] Unlike the LIKE operator, the GLOB operator is case sensitive and uses the UNIX wildcards. In addition, the GLOB patterns do not have escape characters.
```SQL
SELECT
	trackid,
	name
FROM
	tracks
WHERE
    name GLOB 'Man*';

SELECT
	trackid,
	name
FROM
	tracks
WHERE
    name GLOB '*Man';

SELECT
	trackid,
	name
FROM
	tracks
WHERE
    name GLOB '?ere*';

SELECT
	trackid,
	name
FROM
	tracks
WHERE
    name GLOB '*[1-9]*';    

SELECT
	trackid,
	name
FROM
	tracks
WHERE
	name GLOB '*[^1-9]*';
```

8.[IS] [NULL] 
The following statement attempts to find tracks whose composers are NULL:
```SQL
SELECT
    Name, 
    Composer
FROM
    tracks
WHERE
    Composer = NULL;

```
It returns an empty row without issuing any additional message.
To check if a value is NULL or not, you use the IS NULL operator instead:
{ column | expression } IS NULL;


```SQL
SELECT
    Name, 
    Composer
FROM
    tracks
WHERE
    Composer IS NULL
ORDER BY 
    Name;   

SELECT
    Name, 
    Composer
FROM
    tracks
WHERE
    Composer IS NOT NULL
ORDER BY 
    Name;       

```

9. [INNER] [JOIN]
```SQL
SELECT
	trackid,
	name,
	title
FROM
	tracks
INNER JOIN albums ON albums.albumid = tracks.albumid;    

SELECT
    trackid,
    name,
    tracks.albumid AS album_id_tracks,
    albums.albumid As album_id_albums,
    title
FROM
    tracks
INNER JOIN alums ON albums.albumid = tracks.albumid;

SELECT
    trackid,
    tracks.name AS track,
    albums.title AS album,
    artists.name AS artist
FROM 
    tracks
INNER JOIN albums ON albums.albumid = tracks.albumid
INNER JOIN artists ON artists.artistid = albums.artistid; 

SELECT m.firstname || ' ' || m.lastname AS 'Manager',
       e.firstname || ' ' || e.lastname AS 'Direct report'
FROM employees e
INNER JOIN employees m ON m.employeeid = e.reportsto
ORDER BY manager;     

SELECT DISTINCT
    e1.city,
    e1.firstName || ' ' || e1.lastname AS fullname
FROM
    employees e1
INNER JOIN employees e2 ON e2.city = e1.city 
    AND (e1.firstname <> e2.firstname AND e1.lastname <> e2.lastname)
ORDER BY
    e1.city;            
```

10.[LEFT] [JOIN]

```SQL
SELECT
    artists.ArtistId, 
    AlbumId
FROM
    artists
LEFT JOIN albums ON
    albums.ArtistId = artists.ArtistId
ORDER BY
    AlbumId;

SELECT 
    artists.ArtistId,
    AlbumId
FROM
    artists
LEFT JOIN albums ON
    albums.ArtistId = artists.ArtistId
WHERE
    AlbumId IS NULL;
```

11. [RIGHT] [JOIN]
```SQL
SELECT
    employee_name,
    department_name
FROM
    departments
    RIGHT JOIN employees ON employees.department_id = departments.department_id;

# Since both employees and departments tables have the department_id column, you can use the USING clause:

SELECT
    employee_name,
    department_name
FROM
    departments
    RIGHT JOIN employees USING (department_id);

SELECT
    employee_name,
    department_name
FROM
    departments
    RIGHT JOIN employees ON employees.department_id = departments.department_id
WHERE
    department_name IS NULL;
```

12.[FULL] [OUTER] [JOIN]
# Notice that the result of a FULL OUTER JOIN is a combination of  the results of a LEFT JOIN and a RIGHT JOIN.

```SQL
SELECT
    s.student_name,
    c.course_name
FROM
    students s
    FULL OUTER JOIN enrollment e ON s.student_id = e.student_id
    FULL OUTER JOIN courses c ON e.course_id = c.cource_id;
```

13.[GROUP] [BY]
```SQL
SELECT
	albumid,
	COUNT(trackid)
FROM
	tracks
GROUP BY
    albumid;
ORDER BY COUNT(trackid) DESC;

SELECT
	tracks.albumid,
	title,
	COUNT(trackid)
FROM
    tracks
INNER JOIN albums ON albums.albumid = tracks.albumid
GROUP BY
    tracks.albumid;
HAVING COUNT(trackid) > 15;

SELECT
    MediaTypeId, 
    GenreId, 
    COUNT(TrackId)
FROM
    tracks
GROUP BY
    MediaTypeId, 
    GenreId;

SELECT
    STRFTIME('%Y', InvoiceDate) InvoiceYear,
    COUNT(InvoiceId) InvoiceCount
FROM
    invoices
GROUP BY
    STRFTIME('%Y', InvoiceDate)
ORDER BY
    InvoiceYear;
```

14. [HAVING]
# SQLite HAVING clause is an optional clause of the SELECT statement. The HAVING clause specifies a search condition for a group.

```SQL
SELECT 
    albumid,
    COUNT(trackid)
FROM
    tracks
GROUP BY
    albumid
HAVING albumid = 1;

SELECT
    albumid,
    COUNT(trackid)
FROM
    tracks
GROUP BY
    albumid
HAVING
    COUNT(albumid) BETWEEN 18 AND 20
ORDER BY albumid;


```

15. [UNION]
```SQL
SELECT c1 FROM t1
UNION
SELECT c2 FROM t2

c1
---
1
2
3
4

SELECT c1 FROM t1
UNION ALL
SELECT c2 FROM t2

c1
--
1
2
3
2
3
4
``` 
16.[except]

```SQL
CREATE TABLE t1 (c1 INT);
INSERT INTO
    t1 (c1)
VALUES
    (1), (2), (3);    

CREATE TABLE t2 (c2 INT);
INSERT INTO
    t2 (c2)
VALUES
    (2),
    (3),
    (4);    

SELECT c1 FROM t1 #(query one)
EXCEPT
SELECT c2 FROM t2; #(query two)

c1
--
1
```

17. [INTERSECT]
```SQL
CREATE TABLE t1(
    c1 INT
);

INSERT INTO t1(c1)
VALUES(1),(2),(3);

CREATE TABLE t2(
    c2 INT
);
INSERT INTO t2(c2)
VALUES(2),(3),(4);

SELECT c1 FROM t1 #(query one)
INTERSECT
SELECT c2 FROM t2; #(query two)

c1
--
2
3

```

18. [Subquery]

```SQL
SELECT 
    AVG(album.size)
FROM
    (
        SELECT
            SUM(bytes) size
        FROM
            tracks
        GROUP BY 
            albumid               
    ) AS album;    

AVG(album.size)
---------------
  338288920.317    

SELECT albumid,
       title
FROM albums
WHERE 1000000 > (
    SELECT sum(bytes)
    FROM tracks
    WHERE trakcks.AlbumId = albums.AlbumId
)       
ORDER BY title;

SELECT albumid, title,
    (
        SELECT count(trackid)
        FROM tracks
        WHERE tracks.AlbumId = albums.AlbumId
    ) tracks_count
FROM albums
ORDER BY tracks_count DESC;
```

19. [EXISTS]
```SQL
SELECT 
    CustomerId,
    FirstName,
    LastName,
    Company
FROM
    Customers c
WHERE
    EXISTS (
        SELECT 1
        FROM Invoices
        WHERE CustomerId = c.CustomerId
    )
ORDER BY
    FirstName,
    LastName
```
20. [CTE] common table expressions
```SQL
WITH cte_name AS (
    -- cte query definition
)
-- main query using the cte
SELECT * FROM cte_name;

WITH top_tracks AS (
    SELECT trackid, name
    FROM tracks
    ORDER BY trackid
    LIMIT 5
)
SELECT * FROM top_tracks;

WITH customer_sales AS (
    SELECT c.customerid,
           c.firstname || ' ' || c.lastname AS customer_name,
           ROUND(SUM(ii.unitprice * ii.quantity), 2) AS total_sales
    FROM customers c
    INNER JOIN invoices i ON c.customerid = i.customerid
    INNER JOIN invoice_items ii ON i.invoiceid = ii.invoiceid
    GROUP BY c.customerid
)
SELECT customer_name, total_sales
FROM customer_sales
ORDER BY total_sales DESC, customer_name
LIMIT 5;
```

21. [CASE]
    ```SQL
    SELECT 
        customerid,
        firstname,
        lastname,
        CASE country
            WHEN 'USA' THEN 'Dosmetic'
            ELSE 'Foreign'
            END CustomerGroup
    FROM
        customers
    ORDER BY
        LastName,
        FirstName;

    # CustomerId	FirstName	LastName	CustomerGroup
    #    12	        Roberto	    Almeida	    Foreign
    #    28	        Julia	    Barnett	    Dosmetic
    #    39	        Camille	    Bernard	    Foreign
    #    18	        Michelle	Brooks	    Dosmetic

    SELECT
        trackid,
        name,
        CASE 
            WHEN millisecond < 60000 THEN
                'short'
            WHEN millisecond > 6000 AND milliseconds < 300000 THEN 'medium'
            ELSE 'long'
            END category
    FROM 
        tracks;

    # TrackId	    Name	                                        category
        1	        'For Those About To Rock (We Salute You)'	    long
        2	        'Balls to the Wall'	                            long
        3	        'Fast As a Shark'	                            medium
        4	        'Restless and Wild'	                            medium
        5	        'Princess of the Dawn'	                        long
    ```

    
22. [INSERT]
    ```SQL
    INSERT INTO artists (name)
    VALUES('Bud Powell');

    INSERT INTO artists (name)
    VALUES
        ("Buddy Rich"),
	    ("Candido"),
	    ("Charlie Byrd");

    INSERT INTO artists DEFAULT VALUES;

    # SQLite INSERT – Inserting new rows with data provided by a SELECT statement

    CREATE TABLE artists_backup(
        ArtistId INTEGER PRIMARY KEY AUTOINCREMENT,
        Name NVARCHAR
    );

    INSERT INTO artists_backup
    SELECT ArtistId, Name
    FROM artists;
    ```

23. [Update]
    ```SQL
        UPDATE employees
        SET city = 'Toronto',
            state = 'ON',
            postalcode = 'M5P 2N7'
        WHERE 
            employeeid = 4;

        UPDATE employees
        SET email = LOWER(firstname || "." || lastname || "@chinookcorp.com")
        ORDER BY firstname
        LIMIT 1;

        CREATE TABLE sales_employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            salary REAL NOT NULL
        );

        CREATE TABLE sales_performances (
            sales_employee_id INT PRIMARY KEY,
            score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
            FOREIGN KEY (sales_employee_id) REFERENCES sales_employees(id)
        );
        INSERT INTO
            sales_employees (name, salary)
        VALUES
            ('John Doe', 3000.0),
            ('Jane Smith', 3200.0),
            ('Michael Johnson', 2800.0);

        INSERT INTO
            sales_performances (sales_employee_id, score)
        VALUES
            (1, 3),
            (2, 4),
            (3, 2);
        
        UPDATE sales_employees AS e
        SET 
            salary = CASE s.score
                WHEN 1 THEN salary * 1.02
                WHEN 2 THEN salary * 1.04
                WHEN 3 THEN salary * 1.06
                WHEN 4 THEN salary * 1.08
                WHEN 5 THEN salary * 1.10
            END
        FROM sales_performances AS s
        WHERE
            e.id = s.sales_employee_id;

        CREATE TABLE inventory (
            item_id INTEGER PRIMARY KEY,
            item_name TEXT NOT NULL,
            quantity INTEGER NOT NULL
        ); 

        CREATE TABLE sales (
            sales_id INTEGER PRIMARY KEY,
            item_id INTEGER,
            quantity_sold INTEGER,
            sales_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (item_id) REFERENCES inventory (item_id)
        );

        INSERT INTO
            inventory (item_id, item_name, quantity)
        VALUES
            (1, 'Item A', 100),
            (2, 'Item B', 150),
            (3, 'Item C', 200);

        INSERT INTO
            sales (item_id, quantity_sold)
        VALUES
            (1, 20),
            (1, 30),
            (2, 25),
            (3, 50);    

        UPDATE inventory
        SET
            quantity = quantity - daily.qty
        FROM
            (
                SELECT
                    SUM(quantity_sold) AS qty
                    item_id
                FROM
                    sales
                GROUP BY
                    item_id
            ) AS daily
        WHERE
            inventory.item_id = daily.item_id;
    ```

24. [DELETE]
    ```SQL
    DELETE FROM artists_backup 
    WHERE artistid = 1;

    DELETE FROM artists_backup
    WHERE name LIKE '%Santana%';
    ```

25. [REPLACE]
    ```SQL
    SELECT * FROM positions;

    CREATE UNIQUE INDEX idx_positions_title
    ON positions (title)

    REPLACE INTO positions (title, min_salary)
    VALUES ('Full Stack Developer', 140000);
    ```
26. [UPSERT]
    ```SQL
    CREATE TABLE search_stats (
        id INTEGER PRIMARY KEY,
        keyword TEXT UNIQUE NOT NULL,
        search_count INT NOT NULL DEFAULT 1
    );

    INSERT INTO search_stats(keyword)
    VALUE('SQLite');

    INSERT INTO search_stats(keyword)
    VALUES ('SQLite')
    ON CONFLICT (keyword)
    DO
        UPDATE SET search_count = search_count + 1;

    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        effective_date DATE NOT NULL
    );

    INSERT INTO contacts(name, email, phone, effective_date)
    VALUES('Jane Doe', 'jane@test.com', '(408)-111-2222', '2024-04-05');

    SELECT * FROM contacts;

    id  name      email          phone           effective_date
    --  --------  -------------  --------------  --------------
    1   Jane Doe  jane@test.com  (408)-111-2222  2024-04-05

    INSERT INTO
        contacts (name, email, phone, effective_date)
    VALUES
        ('Jane Smith','jane@test.com','(408)-111-3333','2024-05-05')
    ON CONFLICT (email) DO
    UPDATE
    SET 
        name = excluded.name,
        phone = excluded.phone,
        effective_date = excluded.effective_date
    WHERE
        excluded.effective_date > contacts.effective_date;
    
    SELECT * FROM contacts;

    id  name        email          phone           effective_date
    --  ----------  -------------  --------------  --------------
    1   Jane Smith  jane@test.com  (408)-111-3333  2024-05-05

    /**
    1. Upsert is a combination of insert and update.
    2. Upsert allows you to update an existing row or insert a new row if it doesn’t exist in the table.
    3. Use the excluded keyword to access the values you were trying to insert or update.
     */
    ```

27. [RETURNING]
    ```SQL
    CREATE TABLE books(
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        isbn TEXT NOT NULL,
        release_date DATE
    );

    INSERT INTO books(title, isbn, release_date)
    VALUES('The Catcher in the Rye', '9780316769488', '1951-07-16')
    RETURNING *;

    id  title                   isbn           release_date
    --  ----------------------  -------------  ------------
    1   The Catcher in the Rye  9780316769488  1951-07-16

    INSERT INTO books(title, isbn, release_date)
    VALUES ('The Great Gatsby', '9780743273565', '1925-04-10')
    RETURNING id;   

    id
    --
    2 

    INSERT INTO books(title, isbn, release_date)
    VALUES('The Great Gatsby', '9780743273565', '1925-04-10')  
    RETURNING
        id AS book_id,
        strftime('%Y', release_date) AS year;

    book_id  year
    -------  ----
    3        1925

    UPDATE books
    SET isbn = '0141439512'
    WHERE id = 1
    RETURNING *;

    DELETE FROM books
    WHERE id = 1
    RETURNING *;
    ```
28. [TRANSACTION]