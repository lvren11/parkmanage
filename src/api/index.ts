import {deletes, get, getBaseURL, post, put} from './request'

const HttpManager = {
    // 获取图片信息
    attachImageUrl: (url) => `${getBaseURL()}/${url}`,
    // =======================> 管理员 API 完成
    // 是否登录成功
    getLoginStatus: ({uid, pwd}) => post(`user/login/`, {uid, pwd}),
    //注册
    Register: ({tel,pwd}) => post(`user/register/`, {tel, pwd}),
    //多个查询
    getStateBreaking: (page,page_size,state,state2) => get(`breaking/get?page=${page}&page_size=${page_size}&state=${state}&state=${state2}`),
    //获得违停记录
    getAllBreaking: (page,page_size) => get(`breaking/get?page=${page}&page_size=${page_size}`),
    //获取个人违停
    getMyBreaking: (page,page_size,uid) => get(`breaking/get?page=${page}&page_size=${page_size}&uid=${uid}`),
    //审批
    breakingaccess: ({cnum, uid, state, id}) => post(`breaking/review`, {cnum, uid, state, id}),
    //添加违停记录
    addbreaking: ({uid,cnum,state,Info,poster,Date}) => post(`breaking/insert`,{uid,cnum,state,Info,poster,Date}),
    //车辆查询
    getAllCar: (page,page_size,cnum) => get(`car/get?page=${page}&page_size=${page_size}&cnum=${cnum}`),
    //个人车辆
    getMyCar: (page,page_size,uid) => get(`car/get?page=${page}&page_size=${page_size}&uid=${uid}`),
    //车辆添加
    addcar:({cnum,carum,uid}) => post(`car/insert/`, {cnum, carum, uid}),
    //车辆信息修改
    updatecar: ({cnum, carum, uid, id}) =>  put(`car/modify`, {
        cnum, 
        carum, 
        uid, //用户主键
        id //车辆id
    }),
    //车辆删除
    deletecar: (id) =>  deletes(`car/delete?id=${id}`),

    //停车位信息添加
    addparkinglot:({pnum, uid, pst, cnum, startdate,enddate,ust}) => post(`parkingspot/insert/`, {pnum, uid, pst, cnum, startdate,enddate,ust}),
    //停车位信息修改
    updateparkinglot: ({id, pnum, uid, pst, cnum, startdate,enddate,ust}) =>  put(`parkingspot/modify`, {
        id, 
        pnum,
        uid,
        cnum,
        pst,
        startdate,
        enddate,
        ust,
    }),
    //停车位信息删除
    deleteparkinglot: (id) =>  deletes(`parkingspot/delete?id=${id}`),
    //查询
    getAllparkinglot: (page,page_size,pnum,cnum) => get(`parkingspot/get?page=${page}&page_size=${page_size}&pnum=${pnum}&cnum=${cnum}`),

    //租赁
    Buyparkingspot: (id,ust,uid,startdate,enddate) => post(`parkingspot/buy/`, {id, ust, uid,startdate,enddate}),

    updateUserMsg: ({uid, tel, cnum, pwd, pnum, addr, integ}) => put(`user/modify`, {
        uid,
        tel,
        cnum,
        pnum,
        addr,
        integ,
        pwd
    }),
    searchVehicleInfo: (cnum, tel, page, page_size) => get(`car/get?page=${page}&page_size=${page_size}&cnum=${cnum}&tel=${tel}`),

}

export {HttpManager}
