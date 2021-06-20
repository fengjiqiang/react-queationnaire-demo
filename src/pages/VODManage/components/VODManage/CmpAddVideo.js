import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, LargeModal, RLButton, RLInput, RLSelect, RLTable } from '@components/index.js'
import { connect } from 'react-redux';
import actionVideoManage from '@actions/VODManage/actionVideoManage.js';
import { Select } from 'antd';

const { Option } = Select;

class CmpAddVideo extends BaseCmp {
    constructor(props) {
        super(props)
        let select = [];
        let selectList = [];
       
        this.state = {
            listLoading: false,
            group: [],
            searchParam: {
                keyword: 'id',
                value: '',
            },
            videoListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 1,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            allSelect: [...select],                                              //所有选择ID集合
            allSelectList: [...selectList],                                           //所有选择列表集合
        }
        this.selectedRows = [];
    }
    componentDidMount() {
        this.getVideoList()
    }
    getLeftItems = () => {
        return [
            <div className="newSelectArea">
                <RLSelect
                    options={[{
                        label: '视频ID',
                        value: 'id'
                    }, {
                        label: '视频名称',
                        value: 'title'
                    }]}
                    style={{ width: 120, marginLeft: 30, marginRight: 10 }}
                    placeholder='请选择'
                    value={this.state.searchParam.keyword}
                    onChange={(e) => {
                        this.setState({
                            selectOption: e,
                            searchParam: {
                                ...this.state.searchParam,
                                keyword: e
                            }
                        })
                    }}
                />
                <RLInput
                    placeholder='请输入内容'
                    value={this.state.searchParam.value}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                value: e.target.value
                            }
                        })
                    }}
                />
            </div>
        ]
    }
    getRightItems = () => {
        return (
            [
                <RLButton
                    label='搜索'
                    type='primary'
                    onClick={this.getAllUser}
                    style={{ marginRight: 20 }}
                />,
                <RLButton
                    label='重置'
                    type='default'
                    onClick={this.reset}
                    style={{ marginRight: 20 }}
                />
            ]
        )
    }
    reset = () => {
        this.setState({
            searchParam: {
                ...this.state.searchParam,
                keyword: 'id',
                value: ''
            }
        })
    }
    getVideoList = ({ page } = { page: this.state.videoListInfo.page }) => {
        this.setState({
            listLoading: true
        })
        actionVideoManage.getVideoList({
            keyword: this.state.searchParam.value,
            page,
            counts: 10,
        }).then(res => {
            if(!res) return;
            this.setState({
                videoListInfo: {
                    list: res.data.movies,
                    page,
                    count: res.data.counts,
                    pageNum: Math.ceil(res.data.counts / 10)
                }
            });
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }

    getColumns = () => {
        let columns = [{
            title: '视频ID',
            dataIndex: '_id',
            key: '_id',
            width: '20%',
        }, {
            title: '视频名称',
            dataIndex: 'originalname',
            key: 'originalname',
            width: '30%',
        }, {
            title: '视频大小',
            dataIndex: 'size',
            key: 'size',
            width: '20%',
            render: (index, record)=>{
                return <div>{this.parseSize(record.size)}</div>
            }
        }, {
            title: '视频时长',
            dataIndex: 'duration',
            key: 'duration',
            width: '30%',
            render: (index, record)=>{
                return <div>{this.parseDuration(record.duration)}</div>
            }
        }]
        return columns
    }
    pageChange = (page) => {
        this.getVideoList({ page })
    }
    addAction = () => {
      
        if(this.selectedRows.length === 0){
            this.showToast({type:'error',content:'请选择音视频'});
            return;
        }
        this.props.onAdd && this.props.onAdd(this.selectedRows);
        this.props.onCancel();
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
    render() {
        return (
            <LargeModal
                visible={this.props.visible}
                title='选择视频/音频'
                width={1000}
                style={{ height: 580 }}
                wrapClassName='newAddUser'
                onCancel={() => {
                    this.props.onCancel()
                }}
            >
                <div style={{height:450}}>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.listLoading}
                        dataSource={this.state.videoListInfo.list}
                        wrapClassName='newAddUser'
                        rowKey='_id'
                        columns={this.getColumns()}
                        scroll={{ y: 265 }}
                        paginationInfo={{
                            total: this.state.videoListInfo.count,
                            pageSize: 10,
                            onChange: this.pageChange,
                            current: this.state.videoListInfo.page
                        }}
                        rowSelection={{
                            type: 'radio',
                            slectedRowKeys: '_id',
                            onChange: (selectedRowKeys, selectedRows)=>{
                                this.selectedRows = selectedRows;
                            },
                            getCheckboxProps: (record) => ({
                                disabled: record.status !== 'finished'
                            })  
                        }}
                        rowClassName='rl-table-click-row'
                    />
                    <div className='btn-container' style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 10
                    }}>
                        <RLButton label='取消' type='default' height={28}
                            style={{ marginRight: 20 }}
                            onClick={() => {
                                this.props.onCancel()
                            }}
                        />
                        <RLButton
                            label='添加'
                            type='primary'
                            height={28}
                            onClick={this.addAction}
                        />
                    </div>
                </div>
            </LargeModal>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpAddVideo);