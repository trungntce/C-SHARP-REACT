namespace WebApp;

using System.Data;

using Newtonsoft.Json;
using Serilog;

using Framework;
using System.Runtime.CompilerServices;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;

public class MinimalTesterService : MinimalApiService, IMinimalApi
{
    public MinimalTesterService(ILogger<MinimalTesterService> logger) : base(logger)
    {
    }

    #region Sample Code
    static readonly string _json = @"[
                { qnaNo: 7, category: 'QNA', categoryName: '질문', status: 'S01', statusName: '등록', subject: '제목1', body: '내용1', useYn: 'Y', regUserId: 'admin', regDt: '2022-04-01' },
                { qnaNo: 6, category: 'QNA', categoryName: '질문', status: 'S02', statusName: '처리중', subject: '제목2', body: '내용2', useYn: 'Y', regUserId: 'admin', regDt: '2022-03-20' },
                { qnaNo: 5, category: 'GAB', categoryName: '잡담', status: 'S03', statusName: '완료', subject: '제목3', body: '내용3', useYn: 'N', regUserId: 'admin', regDt: '2022-03-19' },
                { qnaNo: 3, category: 'QNA', categoryName: '질문', status: 'S01', statusName: '등록', subject: '제목4', body: '내용4', useYn: 'Y', regUserId: 'admin', regDt: '2022-03-03' },
                { qnaNo: 2, category: 'FRE', categoryName: '일반', status: 'S03', statusName: '완료', subject: '제목5', body: '내용5', useYn: 'Y', regUserId: 'admin', regDt: '2022-03-02' },
                { qnaNo: 1, category: 'FRE', categoryName: '일반', status: 'S01', statusName: '등록', subject: '제목6', body: '내용6', useYn: 'Y', regUserId: 'admin', regDt: '2022-03-01' },
            ]";
    #endregion

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/test", nameof(Test));

        return RouteAllEndpoint(group);
    }

    public static IList<IDictionary<string, object>> List(string category, string keyword)
    {
        return JsonConvert.DeserializeObject<IList<IDictionary<string, object>>>(_json)!;
    }

    public static int Insert(IDictionary<string, object> dic)
    {
        return 1;
    }

    [ManualMap]
    public static string Test()
    {
        return NewShortId();         
    }
}
