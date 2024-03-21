namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class StManagerEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string EqpId { get; set; } = default!;
    public string ModelId { get; set; } = default!;
    public string? StVal{ get; set; }
    public DateTime? CreateDt { get; set; }
    
    public override string ToString()
    {
        return $"{CorpId},{FacId},{EqpId}";
    }
}

public class StList : List<StManagerEntity>
{
    public StList(IEnumerable<StManagerEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
