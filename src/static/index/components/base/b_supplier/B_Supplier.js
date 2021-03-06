/*
 * 完全复用 b_customer 页面, 除了某些样式, 其余只把名字从customer -> supplier
 */

import React from 'react'
import { connect , dispatch } from 'react-redux'
import { push } from 'react-router-redux'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import className from 'classnames'
import cx from 'classnames'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Cascader ,
    Upload , Radio , Progress , InputNumber ,
    Row , Col , Popconfirm ,
    Icon ,Steps
} from 'antd/dist/antd.js'
const Option = Select.Option;
const FormItem = Form.Item ;
const Step = Steps.Step;
const RadioGroup = Radio.Group ;
const RadioButton = Radio.Button ;
import * as service from '../../../service'
import {
    baseSupplierInit ,
    baseSupplierTable ,
    modalShow1_supplier ,
    layerShow1_supplier ,
    modalShow3_supplier ,cancelImport_supplier ,startImport_supplier ,
} from '../../../actions/base.js'
import {
    Detail , Auth , Layer ,
} from '../../index'
import {
    FILE_EXCEL_ACCEPT ,
} from '../../../constants/index'


//SASPLR
//列表 006 OK
//新建 003  OK
//导入 009 OK
//通过id查询详情 002 OK
//编辑指定id 004 OK
//删除制定id 005 OK

const COLUMNS = [
    /*{
    title : '序号' ,
    dataIndex : 'sort' ,
    key : 'sort' ,
    sorter: (a, b) => a.id - b.id ,
},*/
    {
    title : '供应商名称' ,
    dataIndex : 'supplier' ,
    key : 'supplier' ,
    //sorter: (a, b) => a.supplier - b.supplier ,
},{
    title : '应付款' ,
    dataIndex : 'shouldPrice' ,
    key : 'shouldPrice' ,
    sorter: (a, b) => a.shouldPrice - b.shouldPrice ,
},{
    title : '期初欠款' ,
    dataIndex : 'firstPrice' ,
    key : 'firstPrice' ,
    sorter: (a, b) => a.firstPrice - b.firstPrice ,
},{
    title : '联系人' ,
    dataIndex : 'contacter' ,
    key : 'contacter'
},{
    title : '手机号码' ,
    dataIndex : 'phone' ,
    key : 'phone'
},{
    title : '所在地区' ,
    dataIndex : 'dist_forShow' ,
    key : 'dist_forShow'
},{
    title : '操作' ,
    dataIndex : 'operation' ,
    key : 'operation' ,
    render : (text,value) => {
        
        return (
            <span>
                <Auth
                    authIndex="48"
                >
                    <i title="查看" className="sprite-view dib-table-icon" value={value.id}
                       onClick={(event)=>{
                            service.base.fetchBaseSupplierDetail({
                                    id : value.supplierId
                                },(error,result) =>{
                                    if(!error){
                                        globalStore.dispatch(layerShow1_supplier({
                                                id:value.id ,
                                                isShow : true ,
                                                value:result.data
                                            }))
                                    }
                            }
                            )
                       }}
                    ></i>
                </Auth>
                <Auth
                    authIndex="49"
                >
                    <i title="编辑" className="sprite-edit dib-table-icon" value={value.id}
                       onClick={(event)=>{
                            globalStore.dispatch(modalShow1_supplier({
                                isShow : true ,
                                operation : 'edit'
                            }))　;
                            service.base.fetchBaseSupplierDetail({
                                id : value.supplierId
                            },(error,result) => {
                                if ( !error ){
                                    globalEvent.base.editSupplier.dispatch({
                                        operation : 'edit' ,
                                        data : result.data ,
                                        validation : {
                                            name_status : '' ,
                                            name_help : '' ,
                                            earlyDebt_status : '' ,
                                            earlyDebt_help : '' ,
                                            contact_status : '' ,
                                            contact_help : '' ,
                                            telephone_status : '' ,
                                            telephone_help : '' ,
                                            mailBox_status : '' ,
                                            mailBox_help : '' ,
                                            staticPhone_status : '' ,
                                            staticPhone_help : '' ,
                                            fax_status : '' ,
                                            fax_help : '' ,
                                            detailAddress_status : '' ,
                                            detailAddress_help : '' ,
                                            // sort_status : '' ,
                                            // sort_help : '' ,
                                            remarks_status : '' ,
                                            remarks_help : '' ,
                                        } ,
                                    }) ;
                                }
                            }) ;
                       }}
                    ></i>
                </Auth>
                <Auth
                    authIndex="50"
                >
                    <Popconfirm
                        title="确认删除这个供应商吗?"
                        onConfirm={()=>{
                            service.base.deleteBaseSupplier({
                                    id : value.supplierId - 0
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    globalFunction.alert.info( '删除供应商成功'　,　'操作提示'　) ;
                                    var params = {
                                        selectTemp : "" ,
                                        pageSize :10,
                                        pageNum : 1,
                                    };
                                    if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                        params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.userId = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.base.initBaseSupplier(params,(error,data)=>{
                                        globalStore.dispatch(baseSupplierInit(data)) ;
                                    });
                                } else {
                                    globalFunction.alert.warning( result.message　,　'操作提示'　) ;
                                }
                            }) ;
                        }}
                        onCancel={()=>{

                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <i
                            title="删除"
                            className="sprite-delete dib-table-icon"
                            value={value.id}
                        ></i>
                    </Popconfirm>
                </Auth>
            </span>
        )
    }
}] ;

const DETAILS = [{
    title : '应付款' ,
    key : 'shouldPrice'
},{
    title : '期初欠款' ,
    key : 'firstPrice'
},{
    title : '联系人' ,
    key : 'contacter'
},{
    title : '手机号码' ,
    key : 'phone'
},{
    title : '电子邮箱' ,
    key : 'email'
},{
    title : '固定电话' ,
    key : 'staticPhone'
},{
    title : '传真' ,
    key : 'fax'
},{
    title : '所在地区' ,
    key : 'dist_forShow'
},{
    title : '详细地址'  ,
    key : 'area'
}
//     ,{
//     title : '排序' ,
//     key : 'id'
// }
    ,{
    title : '备注' ,
    key : 'tips'
},{
    title : '操作人' ,
    key : 'operation_forShow'
}] ;

class B_Supplier extends React.Component {

    constructor(props){
        super(props) ;
        this.state = {
            percent: 0,
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                keyword : '' ,
            } ,
            editSupplier : (value) => {
                this.setState({
                    modalModel　:　value.data ,
                    validation : value.validation ,
                }) ;
            } ,
            modalModel : {
                supplier : '' ,
                firstPrice : '' ,
                contacter : '' ,
                phone : '' ,
                email : '' ,
                staticPhone : '--' ,
                fax : '',

                dist : '',

                area : '' ,
                // sort　:　'',
                tips : ''　,

                id : '' ,
                shouldPrice : '' ,
                operation : '' ,
            } ,
            modalImport : {
                href : '' ,
                type : '1' ,

                importStatus : 'waiting'　, //waiting / success / failed
                importStatusText: '数据正在导入中...请耐心等待...' ,
                importErrorPath: '' ,
            },
            validation : {
                name_status : '' ,
                name_help : '' ,
                earlyDebt_status : '' ,
                earlyDebt_help : '' ,
                contact_status : '' ,
                contact_help : '' ,
                telephone_status : '' ,
                telephone_help : '' ,
                mailBox_status : '' ,
                mailBox_help : '' ,
                staticPhone_status : '' ,
                staticPhone_help : '' ,
                fax_status : '' ,
                fax_help : '' ,
                detailAddress_status : '' ,
                detailAddress_help : '' ,
                // sort_status : '' ,
                // sort_help : '' ,
                remarks_status : '' ,
                remarks_help : '' ,

                excel_status : '' ,
                excel_help : '' ,
            } ,
        }
    }
    //init for market
    componentDidMount(){
        //data init
        var params = {
            selectTemp : "" ,
            pageSize :10,
            pageNum : 1,
        };
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.base.initBaseSupplier(params,(error,data)=>{
            this.props.baseSupplierInit(data) ;
            this.queryParamsInit( this.props.location.query ) ;
        });
        //global event init
        globalEvent.base.editSupplier = new signals.Signal() ;
        globalEvent.base.editSupplier.add(this.state.editSupplier) ;
    }
    queryParamsInit(params){
        if ( params[ 'state' ] === 'new' ){
            globalStore.dispatch(modalShow1_supplier({
                isShow : true ,
                operation : 'new'
            })) ;
            globalEvent.base.editSupplier.dispatch({
                operation : 'new' ,
                data : {
                    supplier : '' ,
                    firstPrice : '' ,
                    contacter : '' ,
                    phone : '' ,
                    email : '' ,
                    staticPhone : '' ,
                    fax : '',

                    dist : '',

                    area : '' ,
                    // sort　:　'',
                    tips : ''　,

                    id : '' ,
                    shouldPrice : '' ,
                    operation : '' ,
                } ,
                validation : {
                    name_status : '' ,
                    name_help : '' ,
                    earlyDebt_status : '' ,
                    earlyDebt_help : '' ,
                    contact_status : '' ,
                    contact_help : '' ,
                    telephone_status : '' ,
                    telephone_help : '' ,
                    mailBox_status : '' ,
                    mailBox_help : '' ,
                    staticPhone_status : '' ,
                    staticPhone_help : '' ,
                    fax_status : '' ,
                    fax_help : '' ,
                    detailAddress_status : '' ,
                    detailAddress_help : '' ,
                    // sort_status : '' ,
                    // sort_help : '' ,
                    remarks_status : '' ,
                    remarks_help : '' ,
                } ,
            }) ;
        }
    }

    componentWillUnmount(){
        globalEvent.base.editSupplier.remove(this.state.editSupplier) ;
    }
    //filter
    _ev_filterSearch(){
        // console.log( this.state.filter.keyword ) ;
        var params = {
            selectTemp : this.state.filter.keyword ,
            pageSize :10,
            pageNum : 1,
        };
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.base.fetchBaseSupplier(params,(error,data)=>{
            this.props.baseSupplierTable(data) ;
            this.setState({
                currentPage : 1
            });
        });
    }
    //
    _ev_submit_saveAdd(){
        //保存完了之后再次打开新增
        // service.base.
        this._ev_submit_save(()=>{
            globalStore.dispatch(modalShow1_supplier({
                isShow: true,
                operation : 'new'
            })) ;
            globalEvent.base.editSupplier.dispatch({
                operation : 'new' ,
                data : {
                    supplier : '' ,
                    firstPrice : '' ,
                    contacter : '' ,
                    phone : '' ,
                    email : '' ,
                    staticPhone : '' ,
                    fax : '',

                    dist : '',

                    area : '' ,
                    // sort　:　'',
                    tips : ''　,

                    id : '' ,
                    shouldPrice : '' ,
                    operation : '' ,
                } ,
                validation : {
                    name_status : '' ,
                    name_help : '' ,
                    earlyDebt_status : '' ,
                    earlyDebt_help : '' ,
                    contact_status : '' ,
                    contact_help : '' ,
                    telephone_status : '' ,
                    telephone_help : '' ,
                    mailBox_status : '' ,
                    mailBox_help : '' ,
                    staticPhone_status : '' ,
                    staticPhone_help : '' ,
                    fax_status : '' ,
                    fax_help : '' ,
                    detailAddress_status : '' ,
                    detailAddress_help : '' ,
                    // sort_status : '' ,
                    // sort_help : '' ,
                    remarks_status : '' ,
                    remarks_help : '' ,
                } ,
            }) ;
        }) ;
    }
    _ev_submit_save(callbackForSaveAdd){
        //保存
        if ( service.validation.base.form_supplier.supplierName(this.state.modalModel.supplier).validateStatus == 'error' ||
            service.validation.base.form_supplier.supplierEarlyDebt(this.state.modalModel.firstPrice).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierContact(this.state.modalModel.contacter).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierTelphone(this.state.modalModel.phone).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierMailBox(this.state.modalModel.email).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierstaticPhone(this.state.modalModel.staticPhone).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierFax(this.state.modalModel.fax).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierdetailAddress(this.state.modalModel.area).validateStatus == 'error'||
            // service.validation.base.form_supplier.supplierSort(this.state.modalModel.sort).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierRemarks(this.state.modalModel.tips).validateStatus == 'error'
        ){
            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
            return ;
        }
        var params = {
            name : this.state.modalModel.supplier ,
            earlyArrears : this.state.modalModel.firstPrice - 0 ,
            contact : this.state.modalModel.contacter ,
            mobile : this.state.modalModel.phone ,
            tel : this.state.modalModel.staticPhone ,
            fax : this.state.modalModel.fax ,
            location : this.state.modalModel.area , //详细地址
            // sort : this.state.modalModel.sort == '' ? 99999 : this.state.modalModel.sort ,
            comment : this.state.modalModel.tips ,
            email : this.state.modalModel.email ,
            area : this.state.modalModel.dist ,
        };
        //if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        //} else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        //}
        service.base.addBaseSupplier({
            "supplierParameter" : params
        },(result)=>{
            if ( result.mark == '000000000' ){
                //data init
                var params = {
                    selectTemp : "" ,
                    pageSize :10,
                    pageNum : 1,
                };
                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                    params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                } else {
                    params.userId = window.globalStore.getState().userstore.user.id ;
                }
                service.base.initBaseSupplier(params,(error,data)=>{
                    window.globalFunction.alert.info( '新增供应商成功' , '操作提示' ) ;
                    this.props.baseSupplierInit(data) ;
                    this.setState({
                        filter : {
                            keyword : '' ,
                        } ,
                    }) ;
                    callbackForSaveAdd && callbackForSaveAdd() ;
                });

            } else {
                window.globalFunction.alert.warning( result.message , '操作提示' ) ;
            }
        }) ;
    }
    _ev_submit_edit(){
        //console.log(this.state.modalModel);
        //编辑
        if ( service.validation.base.form_supplier.supplierName(this.state.modalModel.supplier).validateStatus == 'error' ||
            service.validation.base.form_supplier.supplierEarlyDebt(this.state.modalModel.firstPrice).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierContact(this.state.modalModel.contacter).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierTelphone(this.state.modalModel.phone).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierMailBox(this.state.modalModel.email).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierstaticPhone(this.state.modalModel.staticPhone).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierFax(this.state.modalModel.fax).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierdetailAddress(this.state.modalModel.area).validateStatus == 'error'||
            // service.validation.base.form_supplier.supplierSort(this.state.modalModel.sort).validateStatus == 'error'||
            service.validation.base.form_supplier.supplierRemarks(this.state.modalModel.tips).validateStatus == 'error'
        ){
            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
            return ;
        }
        var params = {
            id : this.state.modalModel.supplierId ,

            name : this.state.modalModel.supplier ,
            earlyArrears : this.state.modalModel.firstPrice - 0 ,
            contact : this.state.modalModel.contacter ,
            mobile : this.state.modalModel.phone ,
            tel : this.state.modalModel.staticPhone ,
            fax : this.state.modalModel.fax ,
            location : this.state.modalModel.area , //详细地址
            // sort : this.state.modalModel.sort == '' ? 99999 : this.state.modalModel.sort ,
            comment : this.state.modalModel.tips ,
            email : this.state.modalModel.email ,
            area : this.state.modalModel.dist ,
        };
        //if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
       // } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
       // }
        service.base.editBaseSupplier({
            "supplierParameter" : params
        },(result)=>{
            if ( result.mark == '000000000' ){
                //data init
                var params = {
                    selectTemp : "" ,
                    pageSize :this.state.pageSize ,
                    pageNum : this.state.currentPage ,
                };
                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                    params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                } else {
                    params.userId = window.globalStore.getState().userstore.user.id ;
                }
                service.base.initBaseSupplier(params,(error,data)=>{
                    window.globalFunction.alert.info( '供应商更新成功' , '操作提示' ) ;
                    this.props.baseSupplierInit(data) ;
                    this.setState({
                        filter : {
                            keyword : '' ,
                        } ,
                    }) ;
                });
            } else {
                window.globalFunction.alert.warning( result.message , '操作提示' ) ;
            }
        }) ;
    }
    startImport(){
        if ( !this.state.modalImport.href ){
            window.globalFunction.alert.warning( '您尚未选择上传文件' , '操作提示' ) ;
            return ;
        }

        service.base.importBaseSupplier({
            supplierParameter : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                importedExcelPath : this.state.modalImport.href ,
                importedType : this.state.modalImport.type , //1 不导入, 2 覆盖
            }
        },(result)=>{
            if ( result.mark == '000000000' ){
                this.props.startImport_supplier() ;
                if ( result.data.importResult.importedResult == '0' ){
                    this.setState({
                        modalImport : {
                            ...this.state.modalImport ,
                            importStatus : 'success' ,
                            importStatusText: result.data.importResult.importedResultMsg,
                            importErrorPath: '',
                        }
                    }) ;
                    globalFunction.alert.info( '供应商数据已成功导入' , '操作提示' ) ;
                    var self = this ;
                    setTimeout(function(){
                        //data init
                        service.base.initBaseSupplier({
                            userId : window.globalStore.getState().userstore.user.id ,

                            selectTemp : "" ,
                            pageSize :10,
                            pageNum : 1,
                            // userId : 1 ,//
                        },(error,data)=>{
                            self.props.baseSupplierInit(data) ;
                        });
                    },1500) ;
                } else {
                    this.setState({
                        modalImport : {
                            ...this.state.modalImport ,
                            importStatus : 'failed' ,
                            importStatusText: result.data.importResult.importedResultMsg,
                            importErrorPath: result.data.importResult.errorFilePath || '',
                        }
                    }) ;
                    var self = this ;
                    setTimeout(function(){
                        //data init
                        service.base.initBaseSupplier({
                            userId : window.globalStore.getState().userstore.user.id ,

                            selectTemp : "" ,
                            pageSize :10,
                            pageNum : 1,
                            // userId : 1 ,//
                        },(error,data)=>{
                            self.props.baseSupplierInit(data) ;
                        });
                    },1000) ;
                }
            } else {
                globalFunction.alert.warning( result.message , '操作提示' ) ;
                this.setState({
                    modalImport : {
                        ...this.state.modalImport ,
                        importStatus : 'failed' ,
                        importStatusText: '导入文件失败, 请检查网络连接' ,
                        importErrorPath: '' ,
                    }
                })
            }
        }) ;



        this.props.startImport_supplier();
        this.setState({
            modalImport : {
                ...this.state.modalImport ,
                href : '' ,
                importStatus : 'waiting' ,
            }
        }) ;
    }
    //unit
    _unit_className(type){
        if ( type === 'new1' ){
            return className({
                "submit-save-add" : true ,
                "none"　:　this.props.base.b_supplierState.modalType1　===　'new'　?　false　:　true
            })
        } else if ( type === 'new2' ){
            return className({
                "submit-save" : true　,
                "none"　:　this.props.base.b_supplierState.modalType1　===　'new'　?　false　:　true
            })
        } else {
            return　className({
                "submit-save-edit"　:　true　,
                "none"　:　this.props.base.b_supplierState.modalType1　===　'edit'　?　false　:　true
            })
        }
    }

    render (){
        const formItemLayout_modal = {
            labelCol : {span:7} ,
            wrapperCol : {span:10}
        }
        const formItemLayout_modal_submit = {
            wrapperCol : {span:10,offset:7}
        }
        const formItemLayout_modal_import = {
            wrapperCol : {span:6,offset:18}
        }
        var preImport = cx({
            'preImport' : true ,
            'none' : ( this.props.base.b_supplierState.onImportShow　===　true　?　true　:　false )
        }) ;
        var onImport = cx({
            'onImport' : true ,
            'none' : ( this.props.base.b_supplierState.onImportShow　===　true　?　true　:　false )
        }) ;
        return (
            <div>

                <div className="center-east-north">

                    <a className="active">供应商管理</a>

                    <span className="operation">
                        <Auth
                            authIndex="47"
                        >
                            <Button
                                type="ghost"
                                icon="upload"
                                onClick={(event) => {
                                    globalStore.dispatch(modalShow3_supplier(true)) ;
                                    this.setState({
                                        modalImport : {
                                            ...this.state.modalImport ,
                                            importStatus : 'waiting' ,
                                        }
                                    }) ;
                                }}
                            >导入</Button>
                        </Auth>
                        <Auth
                            authIndex="46"
                        >
                            <Button 
                                type="primary" 
                                icon="plus-circle-o" onClick={(event)=>{
                                globalStore.dispatch(modalShow1_supplier({
                                    isShow : true ,
                                    operation : 'new'
                                })) ;
                                globalEvent.base.editSupplier.dispatch({
                                    operation : 'new' ,
                                    data : {
                                        supplier : '' ,
                                        firstPrice : '' ,
                                        contacter : '' ,
                                        phone : '' ,
                                        email : '' ,
                                        staticPhone : '' ,
                                        fax : '',

                                        dist : '',

                                        area : '' ,
                                        // sort　:　'',
                                        tips : ''　,

                                        id : '' ,
                                        shouldPrice : '' ,
                                        operation : '' ,
                                    } ,
                                    validation : {
                                        name_status : '' ,
                                        name_help : '' ,
                                        earlyDebt_status : '' ,
                                        earlyDebt_help : '' ,
                                        contact_status : '' ,
                                        contact_help : '' ,
                                        telephone_status : '' ,
                                        telephone_help : '' ,
                                        mailBox_status : '' ,
                                        mailBox_help : '' ,
                                        staticPhone_status : '' ,
                                        staticPhone_help : '' ,
                                        fax_status : '' ,
                                        fax_help : '' ,
                                        detailAddress_status : '' ,
                                        detailAddress_help : '' ,
                                        // sort_status : '' ,
                                        // sort_help : '' ,
                                        remarks_status : '' ,
                                        remarks_help : '' ,
                                    } ,
                                }) ;
                            }}>新建</Button>
                        </Auth>
                    </span>

                </div>

                <div className="center-east-center">

                    <QueueAnim>

                        <div className="filter-wrap" key="anime-1">
                            <span className="filter">
                                {/*<span className="filter-label">货品名称</span>*/}
                                <span className="filter-component" style={{width:220}}>
                                    <Input
                                        placeholder='供应商名称/联系人'
                                        value={this.state.filter.keyword}
                                        onChange={(event)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    keyword : event.target.value ,
                                                }
                                            })
                                        }}
                                    />
                                </span>
                            </span>
                            <div className="search-wrap base-product" key="anime-2">
                                <Button type="ghost" icon="search" onClick={()=>{
                                    this._ev_filterSearch.call(this) ;
                                }}>查询</Button>
                            </div>
                        </div>

                        <div className="tabel-wrap" key="anime-2">
                        <Table
                            dataSource={this.props.base.b_supplier.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                                showSizeChanger : true ,
                                
                                total : this.props.base.b_supplier.totalCount ,

                                pageSize : this.state.pageSize ,

                                current :　this.state.currentPage ,
                                onShowSizeChange : (current , pageSize)=>{
                                    var self = this;

                                    self.setState({
                                        currentPage : 1 ,
                                        pageSize : pageSize
                                    },()=> {
                                        var params = {
                                            selectTemp : this.state.filter.keyword ,

                                            pageSize :self.state.pageSize,
                                            pageNum : 1,
                                        };
                                        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                        } else {
                                            params.userId = window.globalStore.getState().userstore.user.id ;
                                        }
                                        service.base.initBaseSupplier(params,(error,data)=>{
                                            self.props.baseSupplierInit(data) ;
                                        });
                                    });
                                },
                                onChange : (value)=>{
                                    var self = this;
                                    self.setState({
                                        currentPage : value
                                    });
                                    var params = {
                                        selectTemp : this.state.filter.keyword ,

                                        pageSize :self.state.pageSize,
                                        pageNum : value,
                                    };
                                    if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                        params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.userId = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.base.initBaseSupplier(params,(error,data)=>{
                                        self.props.baseSupplierInit(data) ;
                                    });
                                }
                            }}
                        ></Table>
                    </div>

                    <Modal className="base-modal3" title="导入供应商" visible={this.props.base.b_supplierState.modalShow3}
                           onOk={()=>{this.props.modalShow3_supplier(false)}} onCancel={()=>{this.props.modalShow3_supplier(false)}}
                           footer={
                                <span></span>
                           } width={800}
                    >
                        <div className="modal-content">
                            <Steps className="steps" size="small" current={this.props.base.b_supplierState.currentStep}>
                                <Step title="上传文档" />
                                <Step title="导入数据" />
                                <Step title="完成" />
                            </Steps>
                            <div className={preImport}>
                                <div className="importTips">
                                    <span className="text1">一、请按照数据模板的格式准备要导入的数据</span>
                                    <span className="text2">注意事项</span>
                                    <a
                                        className="text3"
                                        href="http://ehsy-saas.oss-cn-hangzhou.aliyuncs.com/resource/download/%E4%BE%9B%E5%BA%94%E5%95%86%E7%AE%A1%E7%90%86-%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%87%86.xlsx"
                                        target="_blank"
                                    >
                                        下载数据模板
                                    </a>
                                    <div className="text4">
                                        <span>1.模板中的表头名称不可改变，表头行不能删除;</span>
                                        <span>2.项目顺序可以调整，不需要的项目可以删减;</span>
                                        <span>3.其中"客户名称"、"期初欠款"为必填项，不能删除;</span>
                                        <span>4.导入文件请勿超过1MB。</span>
                                    </div>
                                </div>
                                <div className="importForm">
                                    <Form horizontal className="">
                                        <div className="repeatType">
                                            <span>二、请选择数据重复时的操作方式</span>
                                            <span className="text2">查重规则 ：（货品名称、品牌、规格型号）</span>
                                        </div>
                                        <FormItem>
                                            <RadioGroup
                                                value={this.state.modalImport.type}
                                                onChange={(event)=>{
                                                    this.setState({
                                                        modalImport : {
                                                            ...this.state.modalImport ,
                                                            type : event.target.value ,
                                                        }
                                                    })
                                                }}
                                                size="large"
                                            >
                                                <RadioButton value="1">不导入</RadioButton>
                                                <RadioButton value="2">覆盖导入</RadioButton>
                                                {/*<RadioButton value="coverRepeat">不导入新数据，仅覆盖重复数据</RadioButton>*/}
                                            </RadioGroup>
                                        </FormItem>
                                        <div className="chooseImport">
                                            <span>二、请选择需要导入的Excel文件</span>
                                        </div>
                                        <FormItem
                                            style={{paddingLeft:15}}
                                            validateStatus={this.state.validation.excel_status}
                                            help={this.state.validation.excel_help}
                                        >
                                            <Upload
                                                className="upload-excel"
                                                name="file"
                                                showUploadList={false}
                                                action="/api/upload-file-SAITEM007"
                                                beforeUpload={(file)=>{
                                                    if ( file.size > 1024*1024*2 ){
                                                        this.setState({
                                                            validation : {
                                                                ...this.state.validation ,
                                                                excel_status : 'error' ,
                                                                excel_help : '文件大小超过2M' ,
                                                            },
                                                        }) ;
                                                        return false ;
                                                    }
                                                    if ( FILE_EXCEL_ACCEPT.indexOf( file.name.split('.').pop().toLowerCase() ) == -1 ){
                                                        this.setState({
                                                            validation : {
                                                                ...this.state.validation ,
                                                                excel_status : 'error' ,
                                                                excel_help : '文件必须是xls,xlsx格式' ,
                                                            },
                                                        }) ;
                                                        return false ;
                                                    }
                                                    this.setState({
                                                        validation : {
                                                            ...this.state.validation ,
                                                            excel_status : undefined ,
                                                            excel_help : '' ,
                                                        },
                                                    }) ;
                                                }}
                                                onChange={(info)=>{
                                                    if (info.file.status === 'done') {
                                                        var result = info.file.response ;
                                                        if ( result.mark == '000000000' ){
                                                            globalFunction.alert.info( 'excel文件上传成功' , '操作提示' ) ;
                                                            this.setState({
                                                                modalImport : {
                                                                    ...this.state.modalImport ,
                                                                    href : result.data.img_url ,
                                                                }
                                                            }) ;
                                                        } else {
                                                            globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                        }
                                                    } else {
                                                        globalFunction.alert.info( 'excel上传中' , '操作提示' ) ;
                                                    }
                                                }}
                                            >
                                                <Button type="ghost">
                                                    <Icon type="upload" />
                                                    { this.state.modalImport.href ?
                                                        ( this.state.modalImport.href ) :
                                                        '点击上传'
                                                    }
                                                </Button>
                                            </Upload>
                                            <div className="text2">文件大小不超过2M</div>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_modal_import}
                                        >
                                            <Button type="ghost"  htmlType="submit" onClick={this.props.cancelImport_supplier.bind(this)}>取消</Button>
                                            <Button type="primary" className="import-button" htmlType="submit" onClick={this.startImport.bind(this)}>开始导入</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </div>
                            <div className={onImport}>
                                {/*<Progress className="import-percent" strokeWidth={10} percent={this.state.percent} />*/}
                                {/*<span className="onImport-text">数据正在导入中，预计剩余时间1秒</span>*/}
                                <span
                                    className="onImport-text"
                                    style={( this.state.modalImport.importStatus === 'waiting' ? {} : {display:'none'})}
                                >数据正在导入中，请耐心等待。。。<Icon type="loading" /></span>
                                <span
                                    className="onImport-text"
                                    style={( this.state.modalImport.importStatus === 'success' ? {} : {display:'none'})}
                                >{this.state.modalImport.importStatusText}</span>
                                <span
                                    className="onImport-text"
                                    style={( this.state.modalImport.importStatus === 'failed' ? {} : {display:'none'})}
                                >{this.state.modalImport.importStatusText}</span>
                                <div className="tips">
                                    <span>提示：</span>
                                    <span>1.点点帐拥有云端自动导入数据的功能，如果导入时间较长，您可以选择关闭此页面，进行其他操作。</span>
                                    <span>2.数据导入后，将自动给您发送结果通知。</span>
                                </div>
                                {  (this.state.modalImport.importStatus === 'failed' && this.state.modalImport.importErrorPath !== '')?
                                    ( <div className="error">
                                        <a href={this.state.modalImport.importErrorPath}　target="_blink">下载错误报告，查看失败原因</a>
                                    </div> ) :
                                    <div className="error"></div>
                                }
                                <Button
                                    type="primary"
                                    className="closed"
                                    htmlType="submit"
                                    onClick={this.props.cancelImport_supplier.bind(this)}
                                >关闭</Button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        className="base-modal2"
                        title={this.props.base.b_supplierState.modalType1==='new'?'新建供应商':'编辑供应商'}
                        visible={this.props.base.b_supplierState.modalShow1}
                        onOk={()=>{
                                   this.props.modalShow1_supplier({
                                       isShow: false,
                                       operation:'new'
                                   })
                                }
                        }
                        onCancel={()=>{
                            var that = this;
                            Modal.confirm({
                                title: '确认',
                                content: '确认要取消该供应商录入吗',
                                okText: '确认',
                                cancelText: '取消',
                                onOk() {
                                  that.props.modalShow1_supplier({
                                   isShow: false,
                                   operation:'new'
                                   })
                                },
                                onCancel() {},
                              })
                            }
                        }
                    >
                        <div className="modal-content">
                            <Form horizontal className="form-static">
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="供应商名称"
                                    required
                                    hasFeedback
                                    validateStatus={this.state.validation.name_status}
                                    help={this.state.validation.name_help}
                                >
                                    <Input placeholder="请填写供应商名称" value={this.state.modalModel.supplier}
                                           onChange={(event)=>{
                                           var name_validation = service.validation.base.form_supplier.supplierName(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    supplier : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    name_status : name_validation.validateStatus ,
                                                    name_help : name_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="期初欠款"
                                    required
                                >
                                    <InputNumber
                                        placeholder='0.00元'
                                        min={0} 
                                        value={this.state.modalModel.firstPrice}
                                        onChange={(value)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    firstPrice : value
                                                }
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="联系人"
                                    hasFeedback
                                    validateStatus={this.state.validation.contact_status}
                                    help={this.state.validation.contact_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.contacter}
                                           onChange={(event)=>{
                                           var contact_validation = service.validation.base.form_supplier.supplierContact(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    contacter : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    contact_status : contact_validation.validateStatus ,
                                                    contact_help : contact_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="手机号码"
                                    hasFeedback
                                    validateStatus={this.state.validation.telephone_status}
                                    help={this.state.validation.telephone_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.phone}
                                           onChange={(event)=>{
                                           var telephone_validation = service.validation.base.form_supplier.supplierTelphone(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    phone : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    telephone_status : telephone_validation.validateStatus ,
                                                    telephone_help : telephone_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="电子邮箱"
                                    hasFeedback
                                    validateStatus={this.state.validation.mailBox_status}
                                    help={this.state.validation.mailBox_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.email}
                                           onChange={(event)=>{
                                           var mailBox_validation = service.validation.base.form_supplier.supplierMailBox(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    email : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    mailBox_status : mailBox_validation.validateStatus ,
                                                    mailBox_help : mailBox_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="固定电话"
                                    validateStatus={this.state.validation.staticPhone_status}
                                    help={this.state.validation.staticPhone_help}
                                >
                                    <span>
                                        <span className="b-span b-span1">
                                            <Input placeholder="区号" value={this.state.modalModel.staticPhone.split('-')[0]}
                                                   onChange={(event)=>{
                                                   var staticPhone = service.utils.string.staticPhoneChange({
                                                        staticPhone : this.state.modalModel.staticPhone ,
                                                        curStr : event.target.value ,
                                                        index : 1
                                                   }) ;
                                                   var staticPhone_validation = service.validation.base.form_supplier.supplierstaticPhone(staticPhone);
                                                    this.setState({
                                                        modalModel : {
                                                            ...this.state.modalModel ,
                                                            staticPhone : staticPhone
                                                        } ,
                                                        validation : {
                                                            ...this.state.validation ,
                                                            staticPhone_status : staticPhone_validation.validateStatus ,
                                                            staticPhone_help : staticPhone_validation.help ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </span>
                                        <span className="b-span b-span2">-</span>
                                        <span className="b-span b-span3">
                                            <Input placeholder="座机号" value={this.state.modalModel.staticPhone.split('-')[1]}
                                                   onChange={(event)=>{
                                                    var staticPhone = service.utils.string.staticPhoneChange({
                                                        staticPhone : this.state.modalModel.staticPhone ,
                                                        curStr : event.target.value ,
                                                        index : 2
                                                   }) ;
                                                   var staticPhone_validation = service.validation.base.form_supplier.supplierstaticPhone(staticPhone);
                                                    this.setState({
                                                        modalModel : {
                                                            ...this.state.modalModel ,
                                                            staticPhone : staticPhone
                                                        } ,
                                                        validation : {
                                                            ...this.state.validation ,
                                                            staticPhone_status : staticPhone_validation.validateStatus ,
                                                            staticPhone_help : staticPhone_validation.help ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </span>
                                        <span className="b-span b-span4">-</span>
                                        <span className="b-span b-span5">
                                            <Input placeholder="分机号" value={this.state.modalModel.staticPhone.split('-')[2]}
                                                   onChange={(event)=>{
                                                    var staticPhone = service.utils.string.staticPhoneChange({
                                                        staticPhone : this.state.modalModel.staticPhone ,
                                                        curStr : event.target.value ,
                                                        index : 3
                                                   }) ;
                                                   var validation = service.validation.base.form_supplier.supplierstaticPhone(staticPhone) ;
                                                    this.setState({
                                                        modalModel : {
                                                            ...this.state.modalModel ,
                                                            staticPhone : staticPhone
                                                        } ,
                                                        validation : {
                                                            ...this.state.validation ,
                                                            staticPhone_status : validation.validateStatus ,
                                                            staticPhone_help : validation.help ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </span>
                                    </span>

                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="传真"
                                    hasFeedback
                                    validateStatus={this.state.validation.fax_status}
                                    help={this.state.validation.fax_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.fax}
                                           onChange={(event)=>{
                                           var fax_validation = service.validation.base.form_supplier.supplierFax(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    fax : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    fax_status : fax_validation.validateStatus ,
                                                    fax_help : fax_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="所在地区"
                                >
                                    <Cascader
                                        options={this.props.base.b_supplier.city.data}
                                        value={this.state.modalModel.dist === null ? '' : this.state.modalModel.dist.split(' ')}
                                        onChange={(value)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    dist : value.join(' ')
                                                }
                                            })
                                        }}
                                        placeholder="请选择地区"
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="详细地址"
                                    hasFeedback
                                    validateStatus={this.state.validation.detailAddress_status}
                                    help={this.state.validation.detailAddress_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.area}
                                           onChange={(event)=>{
                                           var detailAddress_validation = service.validation.base.form_supplier.supplierdetailAddress(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    area : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    detailAddress_status : detailAddress_validation.validateStatus ,
                                                    detailAddress_help : detailAddress_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                {/*
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="排序"
                                    hasFeedback
                                    validateStatus={this.state.validation.sort_status}
                                    help={this.state.validation.sort_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.sort}
                                           onChange={(event)=>{
                                           var sort_validation = service.validation.base.form_supplier.supplierSort(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    sort : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    sort_status : sort_validation.validateStatus ,
                                                    sort_help : sort_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                 */}
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="备注"
                                    hasFeedback
                                    validateStatus={this.state.validation.remarks_status}
                                    help={this.state.validation.remarks_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.tips}
                                           onChange={(event)=>{
                                           var remarks_validation = service.validation.base.form_supplier.supplierRemarks(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    tips : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    remarks_status : remarks_validation.validateStatus ,
                                                    remarks_help : remarks_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal_submit}
                                >
                                    <Button type="ghost" className={this._unit_className('new1')} htmlType="submit" onClick={this._ev_submit_saveAdd.bind(this)}>保存并新增</Button>
                                    <Button type="primary" className={this._unit_className('new2')} htmlType="submit" onClick={this._ev_submit_save.bind(this)}>保存</Button>

                                    <Button type="primary" className={this._unit_className('edit')} htmlType="submit" onClick={this._ev_submit_edit.bind(this)}>保存</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>

                    <Layer addClass="layer1" layerShow={this.props.base.b_supplierState.layerShow1} _handleLayerHide={()=>{this.props.layerShow1_supplier(false,{})}}>
                        <div className="header">
                            {/*<span className="product-name">
                                {this.props.base.b_supplier.detail?this.props.base.b_supplier.detail.supplier:''}
                            </span>*/}
                            <span
                                className="product-name"
                                onClick={()=>{
                                    this.props.layerShow1_supplier(false,{})
                                }}
                            >
                                <i className="sprite-arrow3"></i>
                                <span className="re-arrow">返回</span>
                            </span>

                            <div className="operation">
                                {/*<a
                                    className="left-arrow"
                                    onClick={()=>{
                                        this.props.layerShow1_supplier(false,{})
                                    }}
                                >&lt;</a>*/}

                                <a
                                    className="edit-arrow"
                                    title="编辑客户"
                                    onClick={(event)=>{
                                        globalStore.dispatch(modalShow1_supplier({
                                            isShow : true ,
                                            operation : 'edit'
                                        }))　;
                                        service.base.fetchBaseSupplierDetail({
                                            id : this.props.base.b_supplier.detail.supplierId
                                        },(error,result) => {
                                            if ( !error ){
                                                globalEvent.base.editSupplier.dispatch({
                                                    operation : 'edit' ,
                                                    data : result.data ,
                                                    validation : {
                                                        name_status : '' ,
                                                        name_help : '' ,
                                                        earlyDebt_status : '' ,
                                                        earlyDebt_help : '' ,
                                                        contact_status : '' ,
                                                        contact_help : '' ,
                                                        telephone_status : '' ,
                                                        telephone_help : '' ,
                                                        mailBox_status : '' ,
                                                        mailBox_help : '' ,
                                                        staticPhone_status : '' ,
                                                        staticPhone_help : '' ,
                                                        fax_status : '' ,
                                                        fax_help : '' ,
                                                        detailAddress_status : '' ,
                                                        detailAddress_help : '' ,
                                                        // sort_status : '' ,
                                                        // sort_help : '' ,
                                                        remarks_status : '' ,
                                                        remarks_help : '' ,
                                                    } ,
                                                }) ;
                                            }
                                        }) ;
                                   }}
                                >
                                    <i className="saas-icon saas-icon-edit"></i>
                                    {/*<span>编辑</span>*/}
                                </a>

                                <a className="down-arrow">
                                    {/*<span>更多</span>*/}
                                    <i className="saas-icon saas-icon-more"></i>
                                    <ul className="more-operation-ul">
                                        <Popconfirm
                                            title="确认删除这个供应商吗?"
                                            onConfirm={()=>{
                                                service.base.deleteBaseSupplier({
                                                    id : this.props.base.b_supplier.detail.supplierId
                                                },(result)=>{
                                                    if ( result.mark == '000000000' ){
                                                        globalFunction.alert.info( '删除供应商成功'　,　'操作提示'　) ;
                                                        var params = {
                                                            selectTemp : "" ,
                                                            pageSize :10,
                                                            pageNum : 1,
                                                        };
                                                        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                                            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                                        } else {
                                                            params.userId = window.globalStore.getState().userstore.user.id ;
                                                        }
                                                        service.base.initBaseSupplier(params,(error,data)=>{
                                                            globalStore.dispatch(baseSupplierInit(data)) ;
                                                        });
                                                    } else {
                                                        globalFunction.alert.warning( result.message　,　'操作提示'　) ;
                                                    }
                                                }) ;
                                            }}
                                            onCancel={()=>{

                                            }}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <li>删除供应商</li>
                                        </Popconfirm>
                                        <li onClick={()=> {
                                            globalStore.dispatch(push('/purchase/order')) ;
                                        }}>查看交易记录</li>
                                    </ul>
                                </a>
                            </div>

                        </div>
                        <div className="content-wrap">
                            <div className="content-title">
                                <span className="product-name">
                                    {this.props.base.b_supplier.detail?this.props.base.b_supplier.detail.supplier:''}
                                </span>
                            </div>
                            <div className="content">
                                <Detail
                                    detailAttr={this.props.DETAILS}
                                    detail={this.props.base.b_supplier.detail}
                                ></Detail>
                            </div>
                        </div>
                    </Layer>
                    </QueueAnim> 
                </div>

            </div>
        )
    }
    /*__findDetails(id){
        let result = {} ;
        this.props.base.b_supplier.dataSource.data.forEach((v)=>{
            if ( v.id === id ){
                result = v
            }
        }) ;
        return result ;
    }*/

}

B_Supplier.defaultProps = {
    COLUMNS : COLUMNS ,
    DETAILS : DETAILS ,
}


export default connect(
    ( state ) => {
        var userstore = state.userstore ;
        var base = state.base ;
        return {
            base ,
            userstore
        }
    },
    {
        baseSupplierInit ,
        baseSupplierTable ,

        modalShow1_supplier ,
        layerShow1_supplier ,

        modalShow3_supplier ,
        cancelImport_supplier ,
        startImport_supplier ,
    }
)(B_Supplier)
