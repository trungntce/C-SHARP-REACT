namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class NoticeEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int NoticeNo { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Body { get; set; }
    public DateTime StartDt { get; set; }
    public DateTime EndDt { get; set; }
    public char UseYn { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{NoticeNo},{Title}";
    }
}

public class NoticeList : List<NoticeEntity>
{
    public NoticeList(IEnumerable<NoticeEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
