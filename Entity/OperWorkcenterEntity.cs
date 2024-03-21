namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

public class OperWorkcenterExtEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string OperCode { get; set; } = default!;
    public string OperDesc { get; set; } = default!;
    public string Workcenter { get; set; } = default!;
    

    public override string ToString()
    {
        return $"{CorpId},{FacId},{OperCode},{OperDesc}";
    }
}