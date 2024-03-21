namespace WebApp;

using System;
using System.Collections.Generic;

using Framework;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class QnaEntity : BaseEntity
{
    public int QnaNo { get; set; }
    public string? Category { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public string? Body { get; set; }
    public char UseYn { get; set; }
    public string? CreateUserId { get; set; }
    public DateTime CreateDt { get; set; }

    public override string ToString()
    {
        return $"{QnaNo},{Category},{Status},{Subject}";
    }
}
