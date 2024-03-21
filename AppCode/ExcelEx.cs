namespace WebApp;

using System;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using Framework;
using OfficeOpenXml;
using OfficeOpenXml.Style;

static public class ExcelEx
{
	static public readonly string SheetName = "Default";

	static public ExcelPackage ToExcel(DataTable dt, List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList, string? sheetName = null)
	{
        ExcelPackage excel = new();
        ExcelWorksheet sheet = excel.Workbook.Worksheets.Add(string.IsNullOrWhiteSpace(sheetName) ? SheetName : sheetName);

        sheet.SetHeader(mapList);
		sheet.SetBody(mapList, dt);

		return excel;
    }

	static public void SetHeader(this ExcelWorksheet sheet, List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList)
	{
		sheet.Cells[1, 1, 1, mapList.Count].SetStyle("#333", true, 12, "#fff");

		for (int i = 0; i < mapList.Count; i++)
		{
            var map = mapList[i];

            sheet.Cells[1, i + 1].Value = map.Item2;
            sheet.Column(i + 1).Width = map.Item3;
        }
	}

	static public void SetBody(this ExcelWorksheet sheet, List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList, DataTable dt)
	{
		for (int i = 0; i < dt.Rows.Count; i++)
        {
			DataRow row = dt.Rows[i];
			List<object> values = new();

			for (int j = 0; j < mapList.Count; j++)
            {
                var map = mapList[j];
				if(map.Item5 == null)
					values.Add(row.TypeCol(UtilEx.ToSnake(map.Item1), map.Item4, null));
				else
					values.Add(map.Item5(row));
            }

			SetValue(sheet, i, values.ToArray());
        }
    }

	static public void SetValue(this ExcelWorksheet sheet, int rowNo, params object[] values)
	{
		string bgColor = "#fff";

		if (rowNo % 2 == 0)
			bgColor = "#fff";
		else
			bgColor = "#f0f0f0";

		SetValue(sheet, rowNo, 1, 0, bgColor, values);
	}

	static public void SetValue(this ExcelWorksheet sheet, int rowNo, int rowSpan, int first, string bgColor, params object[] values)
	{
		int row = rowNo + 2;

		sheet.Cells["A" + row].SetStyle("#fffed4", true, 11);

		for (int i = 0; i < values.Length; i++)
		{
			int col = first + i + 1;

			if (rowSpan > 1)
			{
				string merge = string.Format("{2}{0}:{2}{1}", row, row + rowSpan - 1, col);
				sheet.Cells[merge].Merge = true;
			}

			ExcelRange cell = sheet.Cells[row, col];
			cell.SetStyle(bgColor, false, 11);
			cell.Style.WrapText = true;
			cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            if (values[i] != null && values[i].GetType() == typeof(DateTime))
                cell.Style.Numberformat.Format = "yyyy-MM-dd HH:mm:ss";
            cell.Value = values[i];
			cell.Style.Border.BorderAround(ExcelBorderStyle.Thin, ColorTranslator.FromHtml("#888"));
		}
	}

	static public ExcelRange SetStyle(this ExcelRange cell, string bgColorStr, bool bold, int fontSize, string? fontColorStr = null)
	{
		cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
		cell.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(bgColorStr));
		cell.Style.Font.Bold = bold;
		cell.Style.Font.Size = fontSize;
		if (!string.IsNullOrWhiteSpace(fontColorStr))
			cell.Style.Font.Color.SetColor(ColorTranslator.FromHtml(fontColorStr));

		return cell;
	}

	static public ExcelColumn SetStyle(this ExcelColumn column, string bgColorStr, bool bold, int fontSize)
	{
		column.Style.Fill.PatternType = ExcelFillStyle.Solid;
		column.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(bgColorStr));
		column.Style.Font.Bold = bold;
		column.Style.Font.Size = fontSize;

		return column;
	}

	static public DataTable GetDataTableFromExcel(string path, bool hasHeader = true)
	{
		using (var pck = new OfficeOpenXml.ExcelPackage())
		{
			using (var stream = File.OpenRead(path))
			{
				pck.Load(stream);
			}
			var ws = pck.Workbook.Worksheets.First();
			DataTable tbl = new DataTable();
			foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
			{
				tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
			}
			var startRow = hasHeader ? 2 : 1;
			for (int rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
			{
				var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
				DataRow row = tbl.Rows.Add();
				foreach (var cell in wsRow)
				{
					row[cell.Start.Column - 1] = cell.Text;
				}
			}
			return tbl;
		}
	}

	static public string GetColName(int colNo)
	{
		int dividend = colNo;
		string columnName = String.Empty;
		int modulo;

		while (dividend > 0)
		{
			modulo = (dividend - 1) % 26;
			columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
			dividend = (int)((dividend - modulo) / 26);
		}

		return columnName;
	}

	static public byte[] ToExcelSimple(DataTable dt, IDictionary<string, string> colDic)
	{
        for (int i = dt.Columns.Count - 1; i >= 0; i--)
        {
            var col = dt.Columns[i];

            if (!colDic.ContainsKey(col.ColumnName))
                dt.Columns.Remove(col.ColumnName);
        }

        foreach (var x in colDic.Select((kvp, i) => new { kvp, i }))
        {
            var col = dt.Columns[x.kvp.Key]!;

            col.ColumnName = $"[{x.kvp.Key}]{x.kvp.Value}";
            col.SetOrdinal(x.i);
        }

        return ToExcelSimple(dt);
    }

	static public byte[] ToExcelSimple(DataTable dt)
	{
        using ExcelPackage package = new ();
        ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Sheet1");

        worksheet.Cells["A1"].LoadFromDataTable(dt, true);
		worksheet.Cells[1, 1, 1, dt.Columns.Count].SetStyle("#333", true, 12, "#fff");

		for (int i = 0; i < dt.Columns.Count; i++)
		{
			DataColumn col = dt.Columns[i];

			if (col.DataType == typeof(DateTime))
				worksheet.Cells[$"{GetColName(i+1)}:{GetColName(i+1)}"].Style.Numberformat.Format = "yyyy-MM-dd HH:mm:ss";
		}

        worksheet.Cells.AutoFitColumns();

        using var stream = new MemoryStream();
        package.SaveAs(stream);

        return stream.ToArray();
    }
}