import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Select, Button, Icon } from 'antd';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
import '@/styles/article.scss';

const { TextArea } = Input;
const { Option } = Select;

@inject(stores => ({ inStore: stores.articleFormStore }))
@observer
export default class extends Component {
  mdEditor = null
  mdParser = null
  constructor(props) {
    super(props)
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<div class="hljs">' + hljs.highlight(lang, str).value + '</div>'
          } catch (__) {}
        }    
        return ''
      }
    })
    this.state = {
      formType: props.match.path === "/article/create" ? 'create' : 'update',
      submitType: 'publish'
    }
  }

  componentDidMount() {
    const { inStore, match } = this.props;
    if(this.state.formType === 'update') {
      inStore.getArticleDetail(match.params.id);
    } else {
      inStore.formData = {};
    }
    inStore.getTagList();
    inStore.getCategoryList();
  }

  handleEditorChange ({html, text}) {    
    // console.log('handleEditorChange', html, text)
  }

  handleImageUpload = (file, callback) => {
    this.props.inStore.uploadImg(file, 'content').then(res => {
      callback(res.fullFilePath);
    })
  }

  onFormChange = (k, v) => {
    const { inStore } = this.props;
    inStore.formData[k] = v;
  }

  handleFileChange = files => {
    this.props.inStore.uploadImg(files[0], 'cover').then(res => {
      this.props.inStore.formData['cover'] = res.fullFilePath;
    })
  }

  handleArticleSubmit = (submitType) => {
    let html = this.mdEditor.getHtmlValue();
    let md = this.mdEditor.getMdValue();
    const { inStore } = this.props;
    this.setState({ submitType });
    inStore.putArticle(submitType, this.state.formType, html, md);
  }
  
  render() {
    const { inStore } = this.props;

    const {
      tagList,
      categoryList,
      formData,
      submitLoding
    } = inStore;

    const { formType } = this.state;
    
    return (
      <div className="article-form">
        <div className="page-form">
          <Form layout="horizontal" className="form-flex">
            <Form.Item label="文章标题" required>
              <Input
                value={formData.title}
                onChange={e => this.onFormChange('title', e.target.value)}
                placeholder="请输入文章标题"/>
            </Form.Item>
            <Form.Item label="文章类别" required>
              <Select
                showSearch
                optionFilterProp="children"
                value={formData.category_id}
                dropdownMatchSelectWidth={false}
                onChange={v => this.onFormChange('category_id', v)}
                placeholder="请选择文章分类">
                {
                  categoryList.map(l => 
                    <Option key={l.id} value={l.id}>{l.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
            <Form.Item label="文章标签" required>
              <Select
                mode="tags"
                value={formData.tag_id}
                dropdownMatchSelectWidth={false}
                onChange={v => this.onFormChange('tag_id', v)}
                placeholder="请选择文章标签">
                {
                  tagList.map(l => 
                    <Option key={l.id} value={l.id + ''}>{l.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
            <Form.Item label="文章描述">
              <TextArea
                value={formData.summary}
                onChange={e => this.onFormChange('summary', e.target.value)}
                autosize={{ 'minRows': 2, 'maxRows': 6 }}
                placeholder="请输入文章标题"/>
            </Form.Item>
            <Form.Item label="上传封面">
              <div className="cover-uploader">
                <div className="ant-upload ant-upload-select ant-upload-select-picture-card">
                  <div className="ant-upload-content">
                    <input 
                      type="file"
                        onChange={e => this.handleFileChange(e.target.files)}/>
                    {
                      formData.cover ? 
                      <img src={formData.cover} alt=""/> : <Icon type="plus" />
                    }
                  </div>
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
        
        <div className="article-editor">
          <MdEditor
            style={{ 'minHeight': '420px', 'maxHeight': '800px' }}
            ref={node => this.mdEditor = node}
            value={formData.edit_content || ''}
            renderHTML={(text) => this.mdParser.render(text)}
            onChange={this.handleEditorChange} 
            onImageUpload={this.handleImageUpload} />
        </div>
        <div className="article-btns">
          <Button
            loading={submitLoding && this.state.submitType === 'draft'}
            onClick={this.handleArticleSubmit.bind(null, 'draft')}
            type="primary">保存草稿</Button>
          <Button
            loading={submitLoding && this.state.submitType === 'publish'}
            onClick={this.handleArticleSubmit.bind(null, 'publish')}
            type="primary">{formType === 'update' ? '更新' : '发布'}</Button>
        </div>
      </div>
    )
  }
}