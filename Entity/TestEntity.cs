namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

public class TestEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string TestId { get; set; } = default!;
    public string TestName { get; set; } = default!;
    public int Quantity { get; set; } = default!; 
    public char UseYn { get; set; }
    public int Sort { get; set; }
    public string? Icon { get; set; } = default!;
    public string? Remark { get; set; }
    public List<string>? TestList { get; set; }

    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{TestId},{TestName}";
    }
}

public class TestList : List<TestEntity>
{
    public TestList(IEnumerable<TestEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
