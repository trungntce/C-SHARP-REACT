namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class HeartbeatEntity : BaseEntity
{
    public int Index { get; set; }
    public string EqpCode { get; set; } = default!;
    public string EqpDescription
    {
        get
        {
            return ErpEqpService.SelectCacheName(EqpCode);
        }
    }
    public DateTime PingDt { get; set; }

    public override string ToString()
    {
        return $"{EqpCode},{EqpDescription},{PingDt}";
    }
}