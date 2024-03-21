namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.Reflection.Metadata.Ecma335;
using Framework;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

public class BoxingService : MinimalApiService, IMinimalApi
{
    public BoxingService(ILogger<BoxingService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        //group.MapPut("/pcstoin", nameof(PcsToIn));
        //group.MapPut("/sheettoin", nameof(SheetToIn));
        //group.MapPut("/intoout", nameof(InToOut));
        return RouteAllEndpoint(group);
    }

    //[ManualMap]
    //public static ResultEntity PcsToIn(Array? pieces, string? inBoxId)
    //{
    //    //피스들을 찍고 인박스 찍으면 워크오더 참조해서 피스들에 해당하는 판넬 아이디를 가져온다
    //    //판넬 아이디와 이너박스 아이디를 함께 DB에 넣는다(판넬 아이디 총 개수만큼 로우 생성)

    //    //int cnt = DataContext.StringNonQuery("@BarcodeApi.Boxing.PutLabel");
    //    return new(ResultEnum.OkRollStart);
    //}
    //[ManualMap]
    //public static ResultEntity SheetToIn(Array? sheets, string? inBoxId)
    //{
    //    //시트들을 찍고 인박스 찍으면 워크오더 참조해서 시트들에 해당하는 판넬 아이디를 가져온다
    //    //판넬 아이디와 이너박스 아이디를 함께 DB에 넣는다(판넬 아이디 총 개수만큼)

    //    //int cnt = DataContext.StringNonQuery("@BarcodeApi.Boxing.PutLabel");
    //    return new(ResultEnum.OkRollStart);
    //}
    //[ManualMap]
    //public static ResultEntity InToOut(Array? inBoxIds, string? outBoxId)
    //{
    //    //이너박스 여러개를 찍고 아웃박스를 찍으면, 중복 제외한 이너박스 값들에 아웃박스 값을 넣어준다

    //    //int cnt = DataContext.StringNonQuery("@BarcodeApi.Boxing.PutLabel");
    //    return new(ResultEnum.OkRollStart);
    //}

}
