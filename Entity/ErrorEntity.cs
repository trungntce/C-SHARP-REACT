namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ErrorEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ErrorgroupCode { get; set; } = default!;
    public string ErrorCode { get; set; } = default!;
    public string ErrorMessage { get; set; } = default!;
    public string? EqpCode { get; set; }
    public string? EqpDesc
    {
        get
        {
            if (string.IsNullOrWhiteSpace(EqpCode))
                return string.Empty;

            return ErpEqpService.SelectCacheName(EqpCode);
        }
    }
    public string? EqpErrorCode { get; set; }
    public char UseYn { get; set; } = default!;
    public int Sort { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ErrorgroupCode},{ErrorCode},{ErrorMessage}";
    }
}

public class ErrorList : List<ErrorEntity>
{
    public ErrorList(IEnumerable<ErrorEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
