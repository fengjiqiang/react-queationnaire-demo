import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import { RLInput, RLButton, RLSelect, RLForm, RLFormItem, RLRadioGroup, RLRadio } from '@components/index.js'
import actionVODManage from '@actions/VODManage/actionVODManage.js'
import actionVideoManage from '@actions/VODManage/actionVideoManage.js';
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import config from '@/config.js'

import CmpUpload from '@/pages/common/CmpUpload.js';
import { createRef } from 'react'
import RLCheckbox from '../../../../components/RLCheckbox.js'
import CmpAddVideo from './CmpAddVideo.js';
import '../../../infoManage/components/InfoManage/CmpInfoEdit.less'

const { TabPane } = Tabs

class CmpChapterEdit extends BaseCmp {
    constructor(props) {
        super(props);

        this.chapterId = props.chapterId;
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        this.chapterPage = props.chapterPage;

        this.state = {
            showAddVideoModal: false,
            chapterInfo: props.chapterInfo || {
                                                title: '',
                                                en_title: '',
                                                chapters_thumb: '',
                                                video_id: '',
                                                video_title: '',
                                                video_url: ''
                                            },
            is_edit: this.chapterId ? true : false,  
            language: 'zh',  //zh: 中文 en: 英文  
        }
        this.form = createRef()
    }
    componentWillMount() {

    }

    editConfirm = (values) => {  
        this.setState({
            addLoading: true
        })

        actionVideoManage.getVideoUrl(this.state.chapterInfo.video_id).then(res => {
            // if(res.code === 200){
                // this.setState({
                //     videoLink: res.movies[0].ossurl,
                //     showPreviewModal: true,
                // }); 
                
                let data = {
                    course_id: this.vodId,
                    id: this.chapterId,
                    title: values.title,
                    chapters_thumb: values.chapters_thumb,
                    video_id: this.state.chapterInfo.video_id,
                    video_title: this.state.chapterInfo.video_title,
                    video_url: res.movies[0].ossurl,
                    video_duration: this.state.chapterInfo.video_duration
                };

                data.title = this.state.chapterInfo.title;
                data.en_title = this.state.chapterInfo.en_title;

                if (this.chapterId) {
                    actionVODManage.chapterEdit(data).then(res => {
                        if (res.code === 200) {
                            this.showToast({ content: '编辑章节成功', type: 'success' })
                            this.props.changePage('chapter_list',{
                                vodId: this.vodId,
                                vodPage: this.vodPage,
                                chapterPage: this.chapterPage
                            })
                        } else {
                            this.showToast({ type: 'error', content: res.msg })
                        }
                    }).finally(() => {
                        this.setState({
                            addLoading: false
                        })
                    })
                } else {
                    actionVODManage.chapterAdd(data).then(res => {
                        if (res.code === 200) {
                            this.props.changePage('chapter_list',{
                                vodId: this.vodId,
                                vodPage: this.vodPage,
                                chapterPage: this.chapterPage
                            })
                        } else {
                            this.showToast({ type: 'error', content: res.msg })
                        }
                    }).finally(() => {
                        this.setState({
                            addLoading: false
                        })
                    })
                }

        });

    }

    pageTitle = () => {
        let title = '添加章节'
        if (this.chapterId) {
            title = '编辑章节'
        }
        return (
            <div className="custom-page-title">
                <span>{title}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('chapter_list',{
                            vodId: this.vodId,
                            chapterPage:this.chapterPage,
                            vodPage: this.vodPage
                        });
                    }}
                    label='返回'
                />
            </div>
        )
    }

    createLabel = (labelName, need, style = {}) => {
        return <div>
          {need ? <span style={{ color: '#ff4d4f',fontSize: 14, fontFamily:'SimSun, sans-serif' }}>*</span> : null}
          <span style={{ ...style }}>{labelName}</span>
        </div>
    }
    render() {

        return (
            <WindowContainer title={this.pageTitle}>
                <div className='page-info-edit'>
                    <Tabs defaultActiveKey="zh"
                        style={{ flex: 1 }}
                        onChange={key => {
                            this.setState({
                                language: key
                            })
                        }}
                    >
                        <TabPane tab="中文" key="zh">
                        </TabPane>
                        <TabPane tab="英文" key="en">
                        </TabPane>
                    </Tabs>
                        <RLForm ref={ form => this.form = form}
                            labelCol={{ style: { width: 150, marginRight: 20, marginLeft: 30, textAlign:'right' } }}
                            labelAlign='left'
                            wrapperCol={
                                { span: 24 }
                            }
                            onFinish={this.editConfirm}
                            initialValues={this.state.chapterInfo}
                            validateTrigger='onBlur'
                        >   {
                                this.state.language === 'zh' ? 
                                <RLFormItem label="章节标题" name="title" colon={false}
                                    rules={[{
                                        required: true,
                                        message: '请输入章节标题'
                                    }]}
                                    >
                                    <RLInput 
                                        placeholder="请输入内容"
                                        value={this.state.chapterInfo.title}
                                        style={{width:360}}
                                        onChange={(e)=>{
                                            this.setState({
                                                chapterInfo:{
                                                    ...this.state.chapterInfo,
                                                    title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>:
                                <RLFormItem label="章节标题" name="en_title" colon={false}
                                    rules={[{
                                        required: true,
                                        message: '请输入章节标题'
                                    }]}
                                    >
                                    <RLInput 
                                        placeholder="请输入内容"
                                        value={this.state.chapterInfo.en_title}
                                        style={{width:360}}
                                        onChange={(e)=>{
                                            this.setState({
                                                chapterInfo: {
                                                    ...this.state.chapterInfo,
                                                    en_title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>

                            }
                            <RLFormItem label="章节封面" name="chapters_thumb" colon={false}
                                rules={[{
                                    required: true,
                                    message: '请选择章节封面'
                                }]}
                                >
                                <CmpUpload 
                                    aspect = { 4 / 3}
                                    saveUrl={(fileurl)=>{
                                        this.setState({
                                            chapterInfo: {
                                                ...this.state.chapterInfo,
                                                chapters_thumb: fileurl
                                            }
                                        });
                                        this.form.setFieldsValue({
                                            chapters_thumb: fileurl
                                        });
                                    }}
                                    src={this.state.chapterInfo.chapters_thumb}
                                    imgStyle={{width:86,height:65}}
                                    default={require('../../../../assets/images/default.png').default}
                                />
                                <div>只能上传jpg/png，大小不超过2M，图片比例4:3</div>
                            </RLFormItem>
                            <RLFormItem label={this.createLabel('视频/音频', true)} name="video_id" colon={false}
                                rules={[{
                                    validator: ()=>{
                                        if(!this.state.chapterInfo.video_id){
                                            return Promise.reject('请选择音/视频');
                                        }else{
                                            return Promise.resolve();
                                        }
                                    }
                                }]}>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <RLInput 
                                        value={this.state.chapterInfo.video_title}
                                        style={{width:360}}
                                        disabled={true}
                                    />
                                    <RLButton label="选择音/视频" 
                                        type="primary"
                                        style={{marginLeft:20}}
                                        onClick={()=>{
                                            this.setState({
                                                showAddVideoModal: true
                                            })
                                        }}
                                    />
                                </div>
                            </RLFormItem>
                            <RLFormItem>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <RLButton type="default" label='取消' width={80}
                                        style={{ display: 'inline-block' }}
                                        onClick={() => {
                                            this.props.changePage('chapter_list',{
                                                vodId: this.vodId,
                                                chapterPage:this.chapterPage,
                                                vodPage: this.vodPage
                                            })
                                        }} />
                                    <RLButton type="primary"
                                        htmlType="submit" label={this.chapterId ? '保存' : '添加'}
                                        style={{ marginLeft: 40, display: 'inline-block' }}
                                        loading={this.state.addLoading}
                                        width={80}
                                    />
                                </div>
                            </RLFormItem>
                        </RLForm>
                    
                    {this.state.showAddVideoModal && <CmpAddVideo 
                        visible={this.state.showAddVideoModal}
                        onCancel={()=>{
                            this.setState({
                                showAddVideoModal: false
                            })
                        }}
                        onAdd={(videos)=>{
                            this.setState({
                                chapterInfo: {
                                    ...this.state.chapterInfo,
                                    video_id: videos[0]._id,
                                    video_title: videos[0].originalname,
                                    video_url:videos[0].url,
                                    video_duration: videos[0].duration
                                }
                            });
                            this.form.setFieldsValue({
                                video_id: videos[0]._id
                            });
                        }}
                    />}
                </div>
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        roleList: store.roleManage.roleList,
    }
})(CmpChapterEdit)