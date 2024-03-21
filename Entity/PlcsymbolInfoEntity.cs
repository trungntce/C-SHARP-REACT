namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class PlcsymbolInfoEntity : BaseEntity
{
    public string Symbolkey { get; set; } = default!;
    public string? EqpCode { get; set; }
	public string? ColumnName { get; set; }
	public string? SymbolComment { get; set; }

	public override string ToString()
    {
        return $"{Symbolkey}";
    }
}

public class PlcsymbolInfoList : List<PlcsymbolInfoEntity>
{
    public PlcsymbolInfoList(IEnumerable<PlcsymbolInfoEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
