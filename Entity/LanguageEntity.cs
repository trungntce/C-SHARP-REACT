namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class LanguageEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string LangCode { get; set; } = default!;
    public string NationCode { get; set; } = default!;
    public string LangText { get; set; } = default!;
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{LangCode},{NationCode},{LangText}";
    }
}

public class LanguageSetEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string LangCode { get; set; } = default!;
    public string NationCode { get; set; } = default!;
    public string LangText { get; set; } = default!;
    public List<string> NationCodeList { get; set; } = default!;
    public List<string> LangTextList { get; set; } = default!;
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{LangCode},{string.Join(",", NationCode)},{string.Join(",", LangText)}";
    }
}

public class LanguageList : List<LanguageEntity>
{
    public LanguageList(IEnumerable<LanguageEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
