using System.Data;
using System.Text.Json;
using System.Collections;
using System.Text.Json.Serialization;

namespace WebApp
{
    public class DataTableConverter : JsonConverter<DataTable>
    {
        public override void Write(Utf8JsonWriter writer, DataTable dt, JsonSerializerOptions options)
        {
            if (dt == null)
            {
                writer.WriteNullValue();
                return;
            }

            writer.WriteStartArray();

            foreach (DataRow row in dt.Rows)
            {
                writer.WriteStartObject();
                foreach (DataColumn column in row.Table.Columns)
                {
                    object columnValue = row[column];

                    if (columnValue == null || columnValue == DBNull.Value)
                        continue;

                    writer.WritePropertyName(column.ColumnName);
                    JsonSerializer.Serialize(writer, columnValue, options);
                }
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
        }

        public override DataTable? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
            {
                return null;
            }

            DataTable dt = (typeToConvert == typeof(DataTable))
                ? new DataTable()
                : (DataTable)Activator.CreateInstance(typeToConvert)!;

            // DataTable is inside a DataSet
            // populate the name from the property name
            if (reader.TokenType == JsonTokenType.PropertyName)
            {
                dt.TableName = reader.GetString();

                reader.Read();

                if (reader.TokenType == JsonTokenType.Null)
                {
                    return dt;
                }
            }

            if (reader.TokenType != JsonTokenType.StartArray)
            {
                throw new JsonException($"Unexpected JSON token when reading DataTable. Expected StartArray, got {reader.TokenType}.");
            }

            reader.Read();

            while (reader.TokenType != JsonTokenType.EndArray)
            {
                CreateRow(reader, dt, options);

                reader.Read();
            }

            return dt;
        }

        private static void CreateRow(Utf8JsonReader reader, DataTable dt, JsonSerializerOptions options)
        {
            DataRow dr = dt.NewRow();
            reader.Read();

            while (reader.TokenType == JsonTokenType.PropertyName)
            {
                string columnName = reader.GetString()!;

                reader.Read();

                DataColumn? column = dt.Columns[columnName];
                if (column == null)
                {
                    Type columnType = GetColumnDataType(reader);
                    column = new DataColumn(columnName, columnType);
                    dt.Columns.Add(column);
                }

                if (column.DataType == typeof(DataTable))
                {
                    if (reader.TokenType == JsonTokenType.StartArray)
                    {
                        reader.Read();
                    }

                    DataTable nestedDt = new();

                    while (reader.TokenType != JsonTokenType.EndArray)
                    {
                        CreateRow(reader, nestedDt, options);

                        reader.Read();
                    }

                    dr[columnName] = nestedDt;
                }
                else if (column.DataType.IsArray && column.DataType != typeof(byte[]))
                {
                    if (reader.TokenType == JsonTokenType.StartArray)
                    {
                        reader.Read();
                    }

                    List<object?> o = new();

                    while (reader.TokenType != JsonTokenType.EndArray)
                    {
                        o.Add(reader.GetString());
                        reader.Read();
                    }

                    Array destinationArray = Array.CreateInstance(column.DataType.GetElementType()!, o.Count);
                    ((IList)o).CopyTo(destinationArray, 0);

                    dr[columnName] = destinationArray;
                }
                else
                {
                    object columnValue = (reader.GetString() != null)
                        ? JsonSerializer.Deserialize(ref reader, column.DataType, options) ?? DBNull.Value
                        : DBNull.Value;

                    dr[columnName] = columnValue;
                }

                reader.Read();
            }

            dr.EndEdit();
            dt.Rows.Add(dr);
        }

        private static Type GetColumnDataType(Utf8JsonReader reader)
        {
            JsonTokenType tokenType = reader.TokenType;

            switch (tokenType)
            {
                case JsonTokenType.Number:
                case JsonTokenType.True:
                case JsonTokenType.False:
                case JsonTokenType.String:
                case JsonTokenType.Null:
                case JsonTokenType.EndArray:
                    return typeof(string);
                case JsonTokenType.StartArray:
                    reader.Read();
                    if (reader.TokenType == JsonTokenType.StartObject)
                    {
                        return typeof(DataTable); // nested datatable
                    }

                    Type arrayType = GetColumnDataType(reader);
                    return arrayType.MakeArrayType();
                default:
                    throw new JsonException($"Unexpected JSON token when reading DataTable: {tokenType}");
            }
        }

        
    }
}

