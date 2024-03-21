namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class WorkerEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string WorkerId { get; set; } = default!;
    public string? WorkerName { get; set; }
    public string? RowKey { get; set; }
    public char UseYn { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{WorkerId},{WorkerName},{RowKey}";
    }
}

public class WorkerList : List<WorkerEntity>
{
    public WorkerList(IEnumerable<WorkerEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
