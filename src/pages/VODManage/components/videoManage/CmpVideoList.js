import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea } from '@components/index.js'
import actionVideo from '@actions/VODManage/actionVideoManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import config from '@/config.js';
import { DatePicker, Input } from 'antd';
import actionVideoManage from '../../../../store/actions/VODManage/actionVideoManage';
import { Upload } from 'antd';
import moment from 'moment';
import CmpVideoUploadModal from './CmpVideoUpload.js';
import CmpVideoPlayer from './CmpVideoPlayer.js';
import CmpUpload from '@/pages/common/CmpUpload.js';

class CmpVideoList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            searchParam : {  // 筛选用户列表项
                // status: null,
                // keyword: null,
                type: null,
                value: '',
            },
            videoListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },

            selectedMemberKeys: [],  // 选中的用户
            getListLoading: true,       // 获取列表loading

            videoLink: '', 

            showVideoAddModal: false,

            //修改名称弹框
            showVideoEditModal: false,
            selectedRecord: {},

            showPreviewModal: false,

            showLinkModal: false,
        }
        this.columns = [
            {
                title: '视频基本信息',
                width: '25%',
                key: 'basic',
                render: (text, record, index)=>{
                    return  (<div style={{}}> 
                        <div> 
                            <span>名称:</span>
                            <span style={{marginLeft: 5}}>{record.originalname}</span>
                        </div>
                        <div>
                            <span>ID:</span>
                            <span style={{marginLeft: 5}}>{record._id}</span>
                        </div>
                        <div>
                            <span>时长:</span>
                            <span style={{marginLeft: 5}}>{this.parseDuration(record.duration)}</span>
                        </div>
                    </div>)
                }
            },
            {
                title: '视频大小',
                dataIndex: 'size',
                key: 'size',
                width: '15%',
                render: (size, record) => {
                    return (<div>
                        {this.parseSize(record.size)}
                    </div>)
                }
            },
            {
                title: '上传时间',
                dataIndex: 'createAt',
                key: 'createAt',
                width: '15%',
                render: (text, record) => {
                    return (<div>
                        {this.parseCreateTime(record.createAt)}
                    </div>)
                }
            },
            {
                title: '转码状态',
                key: 'status',
                width: '10%',
                render: (text, record) => {
                    return (<div>
                        {
                            record.status === 'finished' ? <span>转码完成</span> : 
                                <>
                                {
                                    record.status === 'trans&chunk' || record.status === 'waiting' ? <span>转码中</span>:<span>转码失败</span>
                                }
                                </>
                        }
                    </div>)
                }
            },
            {
                title: '上传者',
                dataIndex: 'creator',
                key: 'creator',
                width: '15%'
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '20%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            interfaces.VIDEO_DELETE && 
                            <RLButton
                                type='link'
                                label='删除'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.delVideo(record);
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            interfaces.VIDEO_EDIT &&
                            <RLButton
                                type='link'
                                label='修改名称'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({
                                        selectedRecord: record,
                                        showVideoEditModal: true
                                    })
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            record.status === "finished" && 
                            interfaces.VIDEO_GET_URL &&
                            (
                                <RLButton
                                    type='link' label='预览'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        actionVideoManage.getVideoUrl(record._id).then(res => {
                                            // if(res.code === 200){
                                                this.setState({
                                                    videoLink: res.movies[0].ossurl,
                                                    showPreviewModal: true,
                                                });         
                                            // }
                                        });
                                        // this.setState({
                                        //     videoLink: record.url,
                                        //     showPreviewModal: true,
                                        // })
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                        {
                            record.status === "finished" &&
                            interfaces.VIDEO_PREVIEW &&
                            (
                                <RLButton
                                    type='link'
                                    label='获取链接'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        actionVideoManage.getVideoUrl(record._id).then(res => {
                                            // if(res.code === 200){
                                                this.setState({
                                                    videoLink: res.movies[0].ossurl,
                                                    showLinkModal: true,
                                                });         
                                            // }
                                        });
                                        // this.setState({
                                        //     videoLink: record.url,
                                        //     showLinkModal: true
                                        // })
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                    </div>
                )
            },
        ]
        this.getVideoList(); 
    }
    parseDuration(duration){
        let time = Number.parseInt(duration);
        if(time.toString() === 'NaN'){
            return '';
        }
        if(time > -1){
            var hour = Math.floor(time/3600);
            var min = Math.floor(time/60) % 60;
            var sec = time % 60;
            if(hour < 10) {
                time = '0'+ hour + ":";
            } else {
                time = hour + ":";
            }

            if(min < 10){
                time += "0";
            }
            time += min + ":";

            if(sec < 10){
                time += "0";
            }
            time += sec;
        }
        return time;
    }
    parseSize(size){
        let filesize = Number.parseFloat(size);
        if( filesize.toString() === 'NaN'){
            return '';
        }
        let unit;
        let units = [ 'B', 'K', 'M', 'G', 'TB' ];
        while ( (unit = units.shift()) && filesize > 1024 ) {
            filesize = filesize / 1024;
        }
        return (unit === 'B' ? filesize : filesize.toFixed(2)) + unit;
    }
    parseCreateTime(createdAt){
        let time = moment(createdAt).format('YYYY-MM-DD HH:mm:ss');
        return time;
    }
    componentDidMount() {
        eventBus.addListener('video_res_update', ()=>{
            this.getVideoList();
        });
        this.timer = setInterval(() => {
            this.refreshVideoList();
        }, 180000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    // 删除视频
    delVideo = (record) => {
        this.showModal({
            content: '确认删除后，视频将不可恢复。',
            title: '确定删除该视频?',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.videoDelConfirm(record)
            },
            onCancel: () => { },
            size: 'big'
        })
    }
    getVideoUrl(){
        // actionVideoManage.
    }
    videoDelConfirm = (record) => {
        let data = {
            id: record._id,
            originalname: record.originalname,
        };
        return actionVideoManage.videoDel(data).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' });
                this.getVideoList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }

    getVideoList({ page = this.state.videoListInfo.page } = { page: this.state.videoListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        let data = {
            page,
            counts: this.pageSize
        };
        if(this.state.searchParam.type){
            data[this.state.searchParam.type] = this.state.searchParam.value;
        }
        actionVideoManage.getVideoList(data).then(res => {
            if(res.code === 200){
                if( res.movies && res.movies.length === 0 && page > 1){
                    this.getVideoList({ page: page - 1 })
                }else{
                    this.setState({
                        videoListInfo: {
                            list: res.data.movies,
                            page,
                            count: res.data.counts,
                            pageNum: Math.ceil(res.data.counts / this.pageSize)
                        },
                        getListLoading: false

                    })
                }
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }
    refreshVideoList({ page } = { page: this.state.videoListInfo.page }) {
        actionVideoManage.getVideoList({
            keyword: this.state.searchParam.value || '',
            page,
            counts: this.pageSize
        }).then(res => {
            if(res.code === 200){
                this.setState({
                    videoListInfo: {
                        list: res.data.movies,
                        page,
                        count: res.data.counts,
                        pageNum: Math.ceil(res.data.counts / this.pageSize)
                    }
                })
            }
        }).finally(() => {
        })
    }
    videoEdit = (values) => {
        console.log(values)
        let data = {
            // name: values.title,
            id: this.state.selectedRecord._id,
            originalname: values.title
        }
        actionVideoManage.videoEdit(data).then(res =>{
            if(res.code === 200){
                this.showToast({type:'success',content:'修改成功'});
                this.setState({
                    showVideoEditModal: false
                })
                this.getVideoList();
            }
        }).catch(err => {
            console.log(err);
        })
    }


    setLogo(values){
        console.log(values)
    }
    
    getLeftItems = () => {
        return (
            [
                <RLSelect
                    ref = {c => this.keywordInput = c}
                    allowClear 
                    options={[{label: '视频ID', value: 'ids'},{label: '视频名称', value: 'keyword'}]}
                    style={{ width: 140, marginRight: 20 }}
                    placeholder='请选择'
                    value={this.state.searchParam.type}
                    onChange={(val) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                type: val 
                            }
                        })
                    }}
                    key='type'
                />,
                <RLInput
                    ref={ c => this.valueInput = c }
                    placeholder='请输入'
                    allowClear 
                    key='keyword'
                    style={{ width: 150, marginRight: 20 }}
                    value={this.state.searchParam.value}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                value: e.target.value
                            }
                        })
                    }}
                />,
    
                <RLButton label='搜索'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.getVideoList({page: 1});
                    }}
                    style={{ marginRight: 20 }}
                />,

                <RLButton label='重置'
                    key='add'
                    onClick={() => {
                        this.setState({
                            start_date: null,
                            end_date: null,
                            searchParam : {
                                type: null,
                                value: '',
                            }
                        }, () => {
                            this.getVideoList({page: 1});
                        });
                    }}
                    style={{ marginRight: 20 }}/>,
                <RLButton/>
            ]
        )
    }

    getRightItems = () => {
        return (
            [
                interfaces.VIDEO_ADD && <RLButton
                    label='添加视频/音频'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.setState({
                            showVideoAddModal: true
                        });
                    }}
                    style={{ marginLeft: 20 }}
                    disabled={this.props.uploading}
                />,
                <RLButton
                    label="刷新"
                    key="batch_export"
                    onClick={() =>{
                        this.getVideoList();
                    }}
                    style={{ marginLeft: 20 }}
                />,
            ]
        )
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }

    pageChange = (page, pageSize) => {
        this.getVideoList({ page })
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={[]}/>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.videoListInfo.list}
                        rowKey='uuid'
                        columns={this.columns}
                        // rowSelection={{
                        //     type: 'checkbox',
                        //     onChange: this.onSelectChange,
                        //     getCheckboxProps: (record) => ({
                        //         disabled: false
                        //     })
                        // }}
                        paginationInfo={{
                            total: this.state.videoListInfo.count,
                            // pageSize: this.pageSize,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.videoListInfo.page
                        }}
                        rowClassName='rl-table-click-row'
                    />

                   { this.state.showPreviewModal &&  <CmpVideoPlayer
                        visible={this.state.showPreviewModal}
                        src={this.state.videoLink} 
                        close={()=>{
                            this.setState({
                                showPreviewModal: false
                            })
                        }} 
                    />}

                   { this.state.showLinkModal && <RLModal 
                        title = "显示链接"
                        visible={this.state.showLinkModal}
                        footer={null}
                        onCancel={()=>{ 
                            this.setState({
                                showLinkModal: false
                            })
                        }}>
                        <div style={{display:'flex', flexDirection:'row',alignItems:'center'}}>
                           <div style={{width: '70%'}}>{this.state.videoLink}</div>
                           <RLButton label="复制链接" 
                                type="primary"
                                onClick={()=>{
                                    //复制链接到剪贴板
                                    utils.copy(this.state.videoLink);
                                    this.showToast({type:'success', content: '链接已复制到剪贴板'});
                                    this.setState({
                                        showLinkModal: false
                                    })
                                }}
                                style={{marginLeft: 10}}
                            />
                        </div>
                    </RLModal>}

                   { this.state.showVideoAddModal && <CmpVideoUploadModal
                        title="添加音/视频"
                        accept="video/mp4,video/x-msvideo,video/webm,video/quicktime,audio/mpeg,audio/x-ms-wma,audio/flac,audio/aac,audio/wav"
                        visible={this.state.showVideoAddModal}
                        onCancel={()=>{
                            this.setState({
                                showVideoAddModal: false
                            })
                        }}
                    /> }

                   { this.state.showVideoEditModal &&  <RLModal
                        title="编辑视频/音频"
                        visible={this.state.showVideoEditModal}
                        footer={null}
                        onCancel={()=>{
                            this.setState({
                                showVideoEditModal: false
                            })
                        }}
                        >
                        <RLForm onFinish={this.videoEdit}
                            initialValues={this.state.selectedRecord}>
                            <RLFormItem label="视频/音频标题"
                                colon={false}
                                name="title">
                                <RLInput  defaultValue={this.state.selectedRecord.originalname}/>
                            </RLFormItem>
                            <RLFormItem>
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop: 20}}>
                                    <RLButton label="取消" 
                                        type="normal"
                                        onClick={()=>{
                                            this.setState({ 
                                                showVideoEditModal: false
                                            })
                                        }}
                                        style={{marginRight: 40}}/>
                                    <RLButton label="确定"
                                        htmlType="submit"
                                        type="primary"/>
                                </div>
                            </RLFormItem>
                        </RLForm>
                    </RLModal>}
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        uploading: store.storeCommon.uploading,
    }
})(CmpVideoList)