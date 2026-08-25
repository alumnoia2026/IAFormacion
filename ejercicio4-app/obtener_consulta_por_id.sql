CREATE PROCEDURE obtener_consulta_por_id(IN p_id INT)
BEGIN

    SELECT
        ac.id AS id_consulta,
        ac.Consulta AS pregunta,
        ac.Respuesta AS respuesta,
        c.nombre AS nombre,
        c.apellido AS apellidos
    FROM atencion_cliente ac
    INNER JOIN clientes c
        ON ac.id = c.id_cliente
    WHERE ac.id = p_id;

END
