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
    getAdminBreaking: (page,page_size,state,state2,state3,state4)=> get(`breaking/get?page=${page}&page_size=${page_size}&state=${state}&state=${state2}&state=${state3}&state=${state4}`),
    //获取个人违停
    getMyBreaking: (page,page_size,user_id) => get(`breaking/get?page=${page}&page_size=${page_size}&user_id=${user_id}`),
    //审批
    breakingaccess: ({cnum, user_id, state, id}) => put(`breaking/review/`, {cnum, user_id, state, id}),
    //添加违停记录
    addbreaking: ({user_id,cnum,state,info,poster,date}) => post(`breaking/insert/`,{user_id,cnum,state,info,poster,date}),
    //车辆查询
    getAllCar: (page,page_size,cnum,tel,uid) => get(`car/get?page=${page}&page_size=${page_size}&cnum=${cnum}&tel=${tel}&uid=${uid}`),
    //个人车辆
    getMyCar: (page,page_size,user_id) => get(`car/get?page=${page}&page_size=${page_size}&user_id=${user_id}`),
    //车辆添加
    addcar:({cnum,carum,user_id}) => post(`car/insert/`, {cnum, carum, user_id}),
    //车辆信息修改
    updatecar: ({cnum, carum, user_id, id}) =>  put(`car/modify/`, {
        cnum, 
        carum, 
        user_id, //用户主键
        id //车辆id
    }),
    //车辆删除
    deletecar: (id) =>  deletes(`car/delete?id=${id}`),

    //停车位信息添加
    addparkinglot:({pnum, user_id, pst, cnum, startdate,enddate,ust}) => post(`parkingspot/insert/`, {pnum, user_id, pst, cnum, startdate,enddate,ust}),
    //停车位信息修改
    updateparkinglot: ({id, pnum, user_id, pst, cnum, startdate,enddate,ust}) =>  put(`parkingspot/modify/`, {
        id, 
        pnum,
        user_id,
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
    Buyparkingspot: (id,ust,user_id,startdate) => post(`parkingspot/buy/`, {id, ust, user_id,startdate}),

    updateUserMsg: ({id, tel, cnum, pwd, pnum, addr, integ}) => put(`user/modify/`, {
        id,
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
