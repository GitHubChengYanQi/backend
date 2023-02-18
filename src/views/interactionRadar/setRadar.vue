<template>
  <div class="setRadar_page">
    <div class="setRadar_card">
      <div class="setRadar_content">
        <div class="setRadar_title">基础设置</div>
        <div class="content">
          <div
            class="row"
            :style="item.type == 'cover' ||
              item.type == 'quillEditor' ||
              item.key == 'tsLink' ||
              item.key == 'bgImg' ||
              item.key == 'uploadVideo'
              ? {alignItems:'flex-start'}: {}"
            v-for="(item,index) in setData.changeType"
            :key="index"
          >
            <span class="title" :style="item.key == 'tsLink' ? {transform:'translateY(8px)'}: {}">
              <span class="icon" :style="item.hide ? {opacity: 0} : {}">*</span>
              <span class="text">{{ item.title }}</span>
            </span>
            <span class="import_box">
              <span class="select_box" v-if="item.type == 'select'">
                <a-select
                  class="select"
                  v-model="setData.inputData[item.key]"
                  v-if="item.type == 'select'"
                >
                  <a-select-option
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :value="items.id"
                    :key="indexs"
                  >{{ items.name }}</a-select-option>
                </a-select>
              </span>
              <span class="checkbox_box" v-else-if="item.type == 'checkbox'">
                <a-select
                  class="checkbox"
                  :maxTagCount="1"
                  allowClear
                  mode="multiple"
                  :placeholder="item.placeholder"
                  v-model="setData.inputData[item.key]"
                >
                  <a-select-option
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :value="items.id"
                    :key="indexs"
                  >{{ items.name }}</a-select-option>
                </a-select>
              </span>
              <span class="radio_box" v-else-if="item.type == 'radio'">
                <a-radio-group
                  @change="setType"
                  class="radio"
                  v-model="setData.inputData[item.key]"
                >
                  <a-radio
                    :value="items.code"
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :key="indexs"
                  >{{ items.name }}</a-radio>
                </a-radio-group>
              </span>
              <span class="bgImg_box" v-else-if="item.type == 'bgImgRadio'">
                <a-radio-group
                  @change="setType"
                  class="radio"
                  v-model="setData.inputData[item.key]"
                >
                  <a-radio
                    :value="items.code"
                    v-for="(items,indexs) in selectArr[item.selectKey]"
                    :key="indexs"
                  >{{ items.name }}</a-radio>
                </a-radio-group>
                <span class="btn_box" v-if="setData.inputData[item.key] == 1">
                  <span class="btn" v-for="(items,indexs) in bgImgArr" :key="indexs">
                    <div class="text" @click="setMedium(2,false,items.key)">{{ items.btnTxt }}</div>
                    <div class="upload">
                      <div
                        v-if="setData.inputData[items.key].length != 0"
                        class="cover_img_box"
                        @mouseenter.stop="mouseOver(1,items.key)"
                        @mouseleave.stop="mouseOver(-1)"
                      >
                        <img class="cover_img" :src="setData.inputData[items.key]" alt />
                        <div class="show_box" v-if="isShow && items.key == isShowKey">
                          <span
                            class="btn"
                            @click="()=>{
                              modalVisible = true
                              imageUrl = setData.inputData[items.key]
                            }"
                          >查看</span>
                          <span class="btn" @click="close(items.key)">删除</span>
                        </div>
                      </div>
                    </div>
                  </span>
                </span>
              </span>
              <span class="uploadVideo" v-else-if="item.type == 'uploadVideo'">
                <div
                  class="video_box"
                  v-for="(items,indexs) in setData.inputData[item.key]"
                  :key="indexs"
                >
                  <div class="upload_box">
                    <div class="cover_video_box" v-if="items.video.length != 0 || items.isUpload">
                      <img
                        class="close"
                        :src="require('@/assets/healthManage/u2050.png')"
                        alt
                        @click="closeVideo(indexs)"
                      />
                      <video class="cover_video" :src="items.video" v-if="!items.isUpload" alt />
                      <div class="cover_video" v-if="items.isUpload">
                        <a-spin class="spin" :indicator="items.isUpload" />
                        <img :src="require('@/assets/upload_video.svg')" alt />
                      </div>
                      <div
                        class="reupload"
                        @click="reupload(items,indexs)"
                        v-if="items.isError"
                      >重新上传</div>
                    </div>
                    <div class="add_img_box" @click="setMedium(5,false,item.key,indexs)" v-else>
                      <img class="add_icon" :src="require('@/assets/add_icon.svg')" alt />
                      <div class="index">{{ indexs + 1 }}</div>
                    </div>
                  </div>
                  <div class="input_box">
                    <a-input
                      class="input"
                      placeholder="请输入标题"
                      v-model="items.title"
                      :maxLength="15"
                    ></a-input>
                    <span class="hint">{{ items.title.length + '/' + 15 }}</span>
                  </div>
                </div>
                <div class="btn_box">
                  <a-button
                    type="primary"
                    class="button"
                    @click="()=>{
                      preview = true
                      previewArr = setData.inputData.uploadVideo.filter(item => {
                        return item.video.length > 0
                      })
                    }"
                  >预览</a-button>
                </div>
              </span>
              <span class="cover_box" v-else-if="item.type == 'cover'">
                <div>
                  <div
                    v-if="setData.inputData[item.key].length != 0"
                    class="cover_img_box"
                    @mouseenter.stop="mouseOver(1,item.key)"
                    @mouseleave.stop="mouseOver(-1)"
                  >
                    <img class="cover_img" :src="setData.inputData[item.key]" alt />
                    <div class="show_box" v-if="isShow && item.key == isShowKey">
                      <span
                        class="btn"
                        @click="()=>{
                          modalVisible = true
                          imageUrl = setData.inputData[item.key]
                        }"
                      >查看</span>
                      <span class="btn" @click="close(item.key)">删除</span>
                    </div>
                  </div>
                  <div v-else class="add_img_box" @click="setMedium(2)">
                    <img class="add_icon" :src="require('@/assets/add_icon.svg')" alt />
                  </div>
                </div>
                <div class="hint" v-if="item.hint">{{ item.hint }}</div>
              </span>
              <span class="uploading_box" v-else-if="item.type == 'uploading'">
                <div>
                  <img
                    @click="setMedium(7)"
                    v-if="setData.inputData[item.key].length == 0"
                    class="uploading_icon"
                    :src="require('@/assets/upload_btn.png')"
                    alt
                  />
                  <div class="pdf_box" v-else>
                    <div class="close" @click.stop="close(item.key)">+</div>
                    <div class="icon_box">
                      <img class="icon" :src="require('@/assets/pdf.png')" alt />
                    </div>
                    <div class="title">{{ setData.inputData.linkTitle }}</div>
                  </div>
                </div>
                <div class="hint" v-if="item.hint">{{ item.hint }}</div>
              </span>
              <span class="quillEditor_box" v-else-if="item.type == 'quillEditor'">
                <quill-editor
                  class="quillEditor"
                  @editorChange="editorChange"
                  @setMedium="setMedium"
                  :value="setData.inputData[item.key]"
                  ref="editor"
                />
                <a-button
                  type="primary"
                  class="button"
                  @click="()=>{
                    preview = true
                  }"
                >预览</a-button>
              </span>
              <span class="button_box" v-else-if="item.type == 'button'">
                <a-button type="primary" class="button" @click="setMedium(3)">{{ item.btnText }}</a-button>
                <div class="article" v-if="setData.inputData[item.key].length > 0">
                  <div class="close" @click.stop="close(item.key)">+</div>
                  <img class="article_img" :src="setData.inputData[item.key]" alt />
                  <div class="article_txt">
                    <div class="title">{{ setData.inputData.linkTitle }}</div>
                    <div class="content">{{ setData.inputData.linkDigest }}</div>
                  </div>
                </div>
              </span>
              <span class="input_box" v-else>
                <a-input
                  :disabled="item.key == 'title'&& tableId != -1"
                  class="input"
                  :placeholder="item.placeholder"
                  v-model="setData.inputData[item.key]"
                  :maxLength="item.fontNumber"
                ></a-input>
                <span
                  class="hint"
                  v-if="item.fontNumber"
                >{{ setData.inputData[item.key].length + '/' + item.fontNumber }}</span>
                <a-button
                  v-if="item.btnState"
                  type="primary"
                  @click="getArticle"
                  class="button"
                >生成雷达文章</a-button>
                <div class="article" v-if="item.btnState && setData.inputData.linkImg.length > 0">
                  <div class="close" @click.stop="close('linkImg')">+</div>
                  <img class="article_img" :src="setData.inputData.linkImg" alt />
                  <div class="article_txt">
                    <div class="title">{{ setData.inputData.linkTitle }}</div>
                    <div class="content">{{ setData.inputData.linkDigest }}</div>
                  </div>
                </div>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="setRadar_link">
      <div class="setRadar_title">链接追踪设置</div>
      <div class="setRadar_content">
        <a-checkbox-group
          class="checkbox_box"
          v-model="linkData.linkState"
          :options="linkData.linkType"
        />
        <div class="select_box" v-if="linkData.linkState.includes('2')">
          <div class="select" @click="showBox">选择标签</div>
          <span class="tabs" v-for="(item,index) in tabsArr" :key="index">
            <span>{{ item.name }}</span>
            <span class="empty" @click="empty(item.id)">+</span>
          </span>
        </div>
      </div>
    </div>
    <a-button type="primary" style="margin-top:50px;" @click="setRadar">保存并创建</a-button>
    <a-modal
      v-model="modalState"
      :title="modalTitle"
      centered
      width="700px"
      @ok="setCatalog"
      @cancel="setMedium(-1)"
    >
      <div class="model_input_box">
        <div class="model_tab_box">
          <div
            class="model_tab"
            :style="modelTab == index ? { color:'#1c96f0',borderBottom:'1px solid #1c96f0' }:{}"
            @click="setModelTab(item.key)"
            v-for="(item,index) in isImageText ? tabArr.slice(1,2) : tabArr"
            :key="index"
          >{{ item.title }}</div>
        </div>
        <div class="model_content">
          <div class="upload_box" v-if="modelTab == 0">
            <div v-if="uploadUrl.length == 0 && !isUpload" class="upload_btn" @click="getLink">
              <img class="upload_icon" :src="require('@/assets/upload.svg')" alt />
              <span class="upload_text">{{ modalTitle }}</span>
            </div>
            <a-spin class="spin" v-else-if="isUpload" />
            <div class="show" v-else @click="getLink">
              <img v-if="medium.type == 2" class="upload_image" :src="uploadUrl" alt />
              <video v-else-if="medium.type == 5" :src="uploadUrl" class="upload_image"></video>
              <div class="pdf_box" v-else>
                <div class="icon_box">
                  <img class="icon" :src="require('@/assets/pdf.png')" alt />
                </div>
                <div class="title">{{ uploadName }}</div>
              </div>
            </div>
            <div class="hint" v-if="medium.type == 5">视频最大300M，视频类型MP4、MOV</div>
            <div class="hint" v-if="medium.type == 2 && selectKey != 'linkImg'">
              <div class="text" v-if="setData.inputData.videoFormat == '0'">
                <p v-if="selectKey == 'uploadBgImg'">
                  <span>图片大小不超过10M，建议尺寸：宽375px，支持JPG、JPEG及PNG格式</span>
                </p>
                <p v-if="selectKey == 'uploadTitleBorderImg'">
                  <span>图片大小不超过10M，建议尺寸：347px*40px，支持JPG、JPEG及PNG格式</span>
                </p>
                <p v-if="selectKey == 'uploadVideoBorderImg'">
                  <span>图片大小不超过10M，支持JPG、JPEG及PNG格式</span>
                </p>
                <p v-if="selectKey == 'uploadVideoBorderImg'">
                  <span>视频外边框建议尺寸：347px*195px</span>
                </p>
                <p v-if="selectKey == 'uploadVideoBorderImg'">
                  <span>视频内边框建议尺寸：325px*171px</span>
                </p>
              </div>
              <div class="text" v-else>
                <p v-if="selectKey == 'uploadBgImg'">
                  <span>图片大小不超过10M，建议尺寸：宽375px，支持JPG、JPEG及PNG格式</span>
                </p>
                <p v-if="selectKey == 'uploadTitleBorderImg'">
                  <span>图片大小不超过10M，建议尺寸：347px*40px，支持JPG、JPEG及PNG格式</span>
                </p>
                <p v-if="selectKey == 'uploadVideoBorderImg'">
                  <span>图片大小不超过10M，支持JPG、JPEG及PNG格式</span>
                </p>
                <p v-if="selectKey == 'uploadVideoBorderImg'">
                  <span>视频外边框建议尺寸：264px*469px</span>
                </p>
                <p v-if="selectKey == 'uploadVideoBorderImg'">
                  <span>视频内边框建议尺寸：234px*436px</span>
                </p>
              </div>
            </div>
          </div>
          <div class="material_library_box" v-else>
            <div class="search_box">
              <div class="hint">共有{{ medium.pagination.total }}个素材</div>
              <div class="seach">
                <a-input class="input" v-model="modelSearch" placeholder="输入要搜素的内容"></a-input>
                <a-button type="primary" class="button" @click="searchMedium">搜索</a-button>
                <a-button class="button" @click="resetMedium">清空</a-button>
              </div>
            </div>
            <div class="table_box">
              <a-table
                :columns="medium.columns"
                :row-selection="rowSelection"
                :row-key="record => record.id"
                :data-source="medium.data"
                :pagination="medium.pagination"
                @change="handleTableChange"
              >
                <div slot="contents" slot-scope="text, record">
                  <template>
                    <img
                      v-if="medium.type == 2"
                      :src="record.content.imageFullPath"
                      alt
                      style="width:80px;height:80px;"
                    />
                    <div v-if="medium.type == 7" style="display: flex;flex-direction: column;">
                      <a-icon type="file" theme="twoTone" style="fontSize: 46px;" />
                      <span style="fontSize: 10px;">{{ record.content.fileName }}</span>
                    </div>
                    <video
                      v-if="medium.type == 5"
                      :src="record.content.videoFullPath"
                      style="width:80px;height:80px;"
                    ></video>
                    <div
                      v-if="medium.type == 3"
                      style="display: flex;flex-direction: column;position: relative;"
                    >
                      <img :src="record.content.imageFullPath" alt style="width:100%;height:80px;" />
                      <span
                        style="font-size:10px;width:100%; height:20px; background-color:#000;position:absolute;left:0;bottom:0;color:#fff;"
                      >{{ record.content.maintitle }}</span>
                    </div>
                  </template>
                </div>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <input
      style="display:none"
      type="file"
      accept="image/jpeg, image/png"
      ref="uploadPhotoRef"
      @change="uploadPhoto"
      class="uploadFileInp"
    />
    <input
      style="display:none"
      type="file"
      accept="video/*"
      ref="uploadVideoRef"
      @change="uploadVideo"
      class="uploadFileInp"
    />
    <input
      style="display:none"
      type="file"
      ref="uploadPDFRef"
      @change="uploadPDF"
      name="testFile"
      accept="application/pdf"
    />
    <label-select
      :state="ruleState"
      ref="labelSelect"
      @transmitLabel="transmitLabel"
      @showBox="showBox"
    />
    <a-modal
      width="800px"
      class="viewModal"
      :visible="modalVisible"
      @cancel="()=>{
        modalVisible = false
      }"
      title="附件预览"
    >
      <div class="box" style="width:100%;">
        <img :src="imageUrl" style="width:100%;height:auto;" />
      </div>
      <template slot="footer">
        <a-button
          @click="()=>{
            modalVisible = false
          }"
          key="back">关闭</a-button>
      </template>
    </a-modal>
    <a-modal
      width="800px"
      class="viewModal"
      :visible="preview"
      @cancel="()=>{
        preview = false
      }"
      title="预览"
    >
      <div class="preview_box">
        <img class="bg_img" :src="require('@/assets/phone14.jpg')" />
        <div
          class="content_box ql-editor"
          v-html="setData.inputData.content"
          v-if="setData.inputData.shape != 5"
        ></div>
        <div class="over_box" v-else>
          <div
            class="templateVideo_box"
            :style="setData.inputData.bgImg == '1' && setData.inputData.uploadBgImg.length > 0 ? {
              background: `url(${setData.inputData.uploadBgImg}) no-repeat top left  #FFFFFF`,
              padding : '60px 0 243px 0',
              backgroundSize:'100% auto'
            }: { backgroundColor:'#fff' }"
          >
            <img
              v-if="setData.inputData.bgImg == '0'"
              :src="require('@/assets/default_header.png')"
              class="header"
              alt
            />
            <div
              class="video_box"
              :style="setData.inputData.bgImg == '0' ? {} :{background:'none'}"
            >
              <div class="video" v-for="(item,index) in previewArr" :key="index">
                <div
                  class="title"
                  :style="setData.inputData.bgImg == '0' ? {}:{background: `url(${setData.inputData.uploadTitleBorderImg}) no-repeat center center`}"
                >{{ item.title }}</div>
                <div
                  class="content"
                  :style="{width:setData.inputData.videoFormat == '0' ? '322px' :'245px'}"
                >
                  <img
                    class="bg_img"
                    :style="setData.inputData.videoFormat == '0' ? {
                      width:'322px',
                      height:'181px'
                    } : {
                      width:'245px',
                      height:'435px'
                    }"
                    :src="setData.inputData.bgImg == '0' ? require(`@/assets/default_${setData.inputData.videoFormat == '0' ? 'vertical' :'row'}.png` ): setData.inputData.uploadVideoBorderImg"
                    alt
                  />
                  <video
                    :class="setData.inputData.videoFormat == '0' ? 'vertical' :'row'"
                    :src="item.video"
                  ></video>
                </div>
              </div>
            </div>
            <img
              v-if="setData.inputData.bgImg == '0'"
              :src="require('@/assets/default_bottom.png')"
              class="bottom"
              alt
            />
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button
          @click="()=>{
            preview = false
          }"
          key="back">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import QuillEditor from './components/QuillEditor'
import { upLoad, mediaGetToken, ossUpload } from '@/api/common'
import { materialLibraryList } from '@/api/mediumGroup'
import LabelSelect from './components/LabelSelect'
import SvgIcon from './components/SvgIcon.vue'
import { scrmRadarArticleSave, scrmRadarLabelFind, scrmRadarArticleLoad, scrmRadarArticleGrab } from '@/api/setRadar.js'
import axios from 'axios'

export default {
  components: { 'quill-editor': QuillEditor, 'label-select': LabelSelect, 'svg-icon': SvgIcon },
  data () {
    return {
      oss: {},
      preview: false,
      isShow: false,
      setData: {
        inputType: [
          {
            title: '雷达标题：',
            type: 'input',
            key: 'title',
            fontNumber: 15
          },
          {
            title: '选择分组：',
            type: 'select',
            key: 'unitId',
            selectKey: 'grouping'
          },
          {
            title: '选择渠道：',
            type: 'checkbox',
            key: 'ditch',
            selectKey: 'channel',
            placeholder: '未选中渠道'
          },
          {
            title: '内容类型：',
            type: 'radio',
            key: 'shape',
            selectKey: 'type'
          }
        ],
        inputData: {
          title: '',
          unitId: 0,
          ditch: [],
          shape: '1',
          radarLink: '',
          linkTitle: '',
          linkDigest: '',
          linkImg: '',
          radarPDF: '',
          content: '',
          contentSource: '0',
          tsLink: '',
          articleLink: '',
          materialId: '',
          linkBgImg: '',
          videoFormat: '0',
          bgImg: '0',
          uploadBgImg: '',
          uploadTitleBorderImg: '',
          uploadVideoBorderImg: '',
          uploadVideo: [{
            title: '',
            video: '',
            isUpload: false,
            isError: false
          }, {
            title: '',
            video: '',
            isUpload: false,
            isError: false
          }, {
            title: '',
            video: '',
            isUpload: false,
            isError: false
          }, {
            title: '',
            video: '',
            isUpload: false,
            isError: false
          }, {
            title: '',
            video: '',
            isUpload: false,
            isError: false
          }]
        },
        articleArr: {
          0: [
            {
              type: 'button',
              btnText: '从素材库中引用',
              hide: true,
              key: 'linkImg'
            }
          ],
          1: [
            {
              title: '文章链接：',
              type: 'input',
              key: 'tsLink',
              placeholder: '已绑定的公众号文章链接',
              btnState: true
            }
          ],
          2: [
            {
              title: '链接标题：',
              type: 'input',
              key: 'linkTitle',
              fontNumber: 15
            },
            {
              title: '链接摘要：',
              type: 'input',
              hide: true,
              key: 'linkDigest',
              fontNumber: 30
            },
            {
              title: '链接封面：',
              type: 'cover',
              key: 'linkImg',
              hide: true,
              hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
            },
            {
              title: '具体内容：',
              type: 'quillEditor',
              key: 'content'
            }
          ]
        },
        changeType: []
      },
      selectArr: {
        type: [
          {
            code: '1',
            name: '链接'
          },
          {
            code: '2',
            name: 'PDF'
          },
          {
            code: '3',
            name: '图文/文章'
          },
          {
            code: '4',
            name: '自定义视频'
          },
          {
            code: '5',
            name: '模板视频'
          }
        ],
        grouping: [],
        channel: [],
        sourceType: [
          { code: '0', name: '素材库' },
          { code: '1', name: '公众号' },
          { code: '2', name: '新建' }
        ],
        videoType: [
          { code: '0', name: '横板' },
          { code: '1', name: '竖版' }
        ],
        bgImgType: [
          { code: '0', name: '系统模板' },
          { code: '1', name: '自定义上传' }
        ]
      },
      change: {
        1: [
          {
            title: '雷达链接：',
            type: 'input',
            key: 'radarLink',
            placeholder: '请输入http或https开头的链接地址'
          },
          {
            title: '链接标题：',
            type: 'input',
            key: 'linkTitle',
            fontNumber: 15
          },
          {
            title: '链接摘要：',
            type: 'input',
            hide: true,
            key: 'linkDigest',
            fontNumber: 30
          },
          {
            title: '链接封面：',
            type: 'cover',
            hide: true,
            key: 'linkImg',
            hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
          }
        ],
        2: [
          {
            title: '雷达PDF：',
            type: 'uploading',
            key: 'radarPDF',
            hint: 'PDF文件大小不超过20M'
          }
        ],
        3: [
          {
            title: '内容来源：',
            type: 'radio',
            key: 'contentSource',
            selectKey: 'sourceType'
          }
        ],
        4: [
          {
            title: '链接标题：',
            type: 'input',
            key: 'linkTitle',
            fontNumber: 15
          },
          {
            title: '链接摘要：',
            type: 'input',
            hide: true,
            key: 'linkDigest',
            fontNumber: 30
          },
          {
            title: '链接封面：',
            type: 'cover',
            hide: true,
            key: 'linkImg',
            hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
          },
          {
            title: '具体内容：',
            type: 'quillEditor',
            key: 'content'
          }
        ],
        5: [{
          title: '链接标题：',
          type: 'input',
          key: 'linkTitle',
          fontNumber: 15
        },
        {
          title: '链接摘要：',
          type: 'input',
          hide: true,
          key: 'linkDigest',
          fontNumber: 30
        },
        {
          title: '链接封面：',
          type: 'cover',
          hide: true,
          key: 'linkImg',
          hint: '图片大小不超过10M，支持JPG、JPEG及PNG格式'
        }, {
          title: '视频版式',
          type: 'radio',
          key: 'videoFormat',
          selectKey: 'videoType'
        }, {
          title: '背景图：',
          type: 'bgImgRadio',
          key: 'bgImg',
          selectKey: 'bgImgType'
        }, {
          title: '上传视频：',
          type: 'uploadVideo',
          key: 'uploadVideo'
        }]
      },
      modalState: false,
      modalVisible: false,
      imageUrl: '',
      modalTitle: '上传图片',
      modelTab: 0,
      uploadUrl: '',
      uploadName: '',
      maintitle: '',
      modelSearch: '',
      isImageText: false,
      tabArr: [
        { title: '本地上传', key: 0 },
        { title: '素材库', key: 1 }
      ],
      medium: {
        type: 2, // 类型 2图片 3图文 5 视频 7 文件
        columns: [
          {
            title: '标题',
            dataIndex: 'title',
            align: 'center',
            width: 60
          },
          {
            title: '内容',
            dataIndex: 'contents',
            align: 'center',
            scopedSlots: { customRender: 'contents' },
            ellipsis: true,
            width: 120
          },
          {
            title: '上传者',
            dataIndex: 'userName',
            align: 'center',
            width: 100
          },
          {
            title: '发送次数',
            dataIndex: 'sendCount',
            align: 'center'
          },
          {
            title: '素材来源',
            dataIndex: 'mediumGroupName',
            align: 'center',
            width: 100
          },
          {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
            width: 100
          },
          {
            title: '添加时间',
            dataIndex: 'createdAt',
            align: 'center',
            width: 120
          }
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
          showSizeChanger: true
        },
        data: []
      },
      radio: {
        id: -1,
        content: {},
        idArr: []
      },
      linkData: {
        linkType: [
          { label: '行为通知 （当客户点击雷达链接时，发送雷达链接的员工将会收到消息提醒）', value: '0' },
          { label: '动态通知（当客户点击雷达链接时，会将客户的打开行为记录在客户动态里）', value: '1' },
          { label: '客户标签（给点击雷达链接的客户打上选中的标签）', value: '2' }
        ],
        linkState: []
      },
      ruleState: false,
      isEditor: false,
      tabsArr: [],
      tableId: -1,
      bgImgArr: [
        {
          btnTxt: '上传背景图',
          key: 'uploadBgImg'
        },
        {
          btnTxt: '上传标题边框',
          key: 'uploadTitleBorderImg'
        },
        {
          btnTxt: '上传视频边框',
          key: 'uploadVideoBorderImg'
        }],
      selectKey: null,
      isShowKey: null,
      selectIndex: 0,
      source: null,
      isUpload: false,
      previewArr: []
    }
  },
  created () {
    this.setType()
    this.getUrl()
    this.getFind()
  },
  computed: {
    dataListSelectionKeys () {
      return this.radio.idArr || []
    },
    rowSelection () {
      return {
        type: 'radio', // 单选按钮定义
        selectedRowKeys: this.dataListSelectionKeys,
        onChange: (key, row) => {
          this.getRadio(key, row[0])
        },
        getCheckboxProps: (record) => ({
          props: {
            // 全部默认禁止选中
            disabled: record.type == '文件' ? record.content.fileName.split('.')[1] != 'pdf' : false
          }
        })
      }
    }
  },
  methods: {
    closeVideo (e) {
      this.$confirm({
        title: '提示',
        content: '是否确定删除该上传视频？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.setData.inputData.uploadVideo[e].video = ''
          this.setData.inputData.uploadVideo[e].isUpload = false
          if (this.setData.inputData.uploadVideo[e].source) {
            this.setData.inputData.uploadVideo[e].source.cancel('取消上传')
            this.setData.inputData.uploadVideo[e].source = null
          }
        },
        onCancel () { }
      })
    },
    getArticle () {
      console.log(this.setData.inputData.tsLink)
      if (!this.isUrl(this.setData.inputData.tsLink, 1)) { return this.$message.warn('微信文章链接 必须以 https://mp.weixin.qq.com/s/ 开头') }
      const obj = {
        link: this.setData.inputData.tsLink
      }
      scrmRadarArticleGrab(obj).then((res) => {
        console.log(res)
        this.setData.inputData.articleLink = this.setData.inputData.tsLink
        console.log(this.setData.inputData.articleLink)
        for (const key in res.data) {
          this.setData.inputData[key] = res.data[key]
        }
      })
    },
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return
      this.tableId = object.id
      this.getInfo()
    },
    getInfo () {
      console.log(this.tableId)
      const obj = {
        id: this.tableId
      }
      scrmRadarArticleLoad(obj).then((res) => {
        console.log(res)
        const { data } = res.data
        const inputArr = ['title', 'unitId']
        const { inputData } = this.setData

        const entry = {
          1: ['radarLink', 'linkTitle', 'linkDigest', 'linkImg'],
          2: ['radarPDF', 'linkTitle'],
          3: {
            0: ['linkTitle', 'linkDigest', 'linkImg', 'materialId', 'articleLink'],
            1: ['linkTitle', 'linkImg', 'articleLink', 'linkDigest'],
            2: ['linkImg', 'linkTitle', 'linkDigest', 'content']
          },
          4: ['linkImg', 'linkTitle', 'linkDigest', 'content'],
          5: ['linkImg', 'linkTitle', 'linkDigest', 'videoFormat', 'bgImg', 'uploadVideo', 'uploadBgImg', 'uploadTitleBorderImg', 'uploadVideoBorderImg']
        }
        // const shapeArr = ['链接', 'PDF', '图文/文章', '视频']
        for (const key in data) {
          if (inputArr.includes(key)) {
            this.setData.inputData[key] = data[key]
          }
        }

        this.setData.inputData.ditch = data.ditch.map((item) => {
          return item.id
        })
        this.setData.inputData.shape = data.shape
        this.setData.inputData.contentSource = data.entry.contentSource
        this.setData.inputData.tsLink = data.entry.articleLink

        for (const key in data.entry) {
          if (inputData.shape == '3') {
            if (entry[inputData.shape][inputData.contentSource].includes(key)) {
              console.log(data.entry[key], key)
              this.setData.inputData[key] = data.entry[key]
            }
          } else {
            if (entry[inputData.shape].includes(key)) {
              console.log(data.entry[key], key)
              this.setData.inputData[key] = data.entry[key]
            }
          }
        }
        if (this.setData.inputData.shape == '5' && this.setData.inputData.uploadVideo.length < 5) {
          const sum = 5 - this.setData.inputData.uploadVideo.length
          for (let i = 0; i < sum; i++) {
            this.setData.inputData.uploadVideo = [...this.setData.inputData.uploadVideo, {
              title: '',
              video: '',
              isUpload: false,
              isError: false
            }]
          }
        }
        if (this.setData.inputData.shape == 3) {
        }
        this.linkData.linkState = data.track.linkType
        this.tabsArr = data.track.linkState
        this.setType(false)
      })
    },
    mouseOver (e, key) {
      console.log(e)
      this.isShow = e == 1
      this.isShowKey = key
    },
    getFind () {
      const obj = {}
      scrmRadarLabelFind(obj).then((res) => {
        console.log(res)
        const { data } = res
        this.selectArr.grouping = data.group
        this.selectArr.channel = data.ditch
        if (data.ditch.length == 1) {
          this.setData.inputData.ditch = [data.ditch[0].id]
        }
      })
    },
    close (key) {
      this.setData.inputData[key] = ''
      this.isShow = false
    },
    empty (e) {
      this.tabsArr = this.tabsArr.filter((item) => {
        return item.id != e
      })
    },
    reupload (item, index) {
      this.selectIndex = index
      const obj = {}
      const arr = ['title', 'video', 'isUpload', 'isError', 'fileInfo', 'source']
      for (const i in item) {
        if (!arr.includes(i)) {
          obj[i] = item[i]
        }
      }
      item.source.cancel('重新上传')
      this.dealUploadMethod(obj, obj.fileInfo)
    },
    showBox (e) {
      this.ruleState = e != -1
      if (e != -1) {
        this.$refs.labelSelect.idArr = this.tabsArr.map((item) => {
          return item.id
        })
        this.$refs.labelSelect.inputArr = this.tabsArr
      }
    },
    transmitLabel (e) {
      console.log(e)
      this.tabsArr = e
    },
    setRadar () {
      const { inputData } = this.setData
      const { linkState } = this.linkData
      const inputArr = ['title', 'unitId', 'ditch', 'shape']
      const entry = {
        1: ['radarLink', 'linkTitle', 'linkDigest', 'linkImg'],
        2: ['radarPDF', 'linkTitle'],
        3: {
          0: ['linkTitle', 'linkDigest', 'linkImg', 'materialId', 'contentSource', 'articleLink'],
          1: ['linkTitle', 'linkImg', 'linkDigest', 'articleLink', 'contentSource'],
          2: ['linkImg', 'linkTitle', 'linkDigest', 'content', 'contentSource']
        },
        4: ['linkImg', 'linkTitle', 'linkDigest', 'content'],
        5: ['linkImg', 'linkTitle', 'linkDigest', 'videoFormat', 'bgImg', 'uploadBgImg', 'uploadTitleBorderImg', 'uploadVideoBorderImg']
      }
      const obj = {
        entry: {},
        ditch: [],
        track: {
          linkType: linkState,
          linkState: this.tabsArr.map((item) => {
            const obj = {}
            obj.id = item.id
            obj.name = item.name
            return obj
          })
        }
      }
      for (const key in inputData) {
        if (inputArr.includes(key)) {
          obj[key] = inputData[key]
        } else {
          if (inputData.shape == '3') {
            if (entry[inputData.shape][inputData.contentSource].includes(key)) {
              console.log(inputData[key], key)
              obj.entry[key] = inputData[key]
            }
          } else {
            if (entry[inputData.shape].includes(key)) {
              console.log(inputData[key], key)
              obj.entry[key] = inputData[key]
            }
          }
        }
      }
      obj.ditch = this.selectArr.channel.filter((item) => {
        return obj.ditch.includes(item.id)
      })
      if (inputData.shape == '5') {
        const uploadVideo = inputData.uploadVideo.map(item => {
          const obj = {}
          obj.title = item.title
          obj.video = item.video
          return obj
        }).filter(item => {
          return item.video.length > 0
        })
        obj.entry.uploadVideo = uploadVideo
        obj.entry.linkImg = obj.entry.linkImg.length == 0 ? 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16734956389240028712.png?Expires=1829034062&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=T5uHInepozbFoYfL2bMajwt%2BMWg%3D' : obj.entry.linkImg
      }
      if (!this.isUrl(obj.entry.radarLink) && obj.shape == 1) return this.$message.warn('请检查雷达链接')
      console.log(obj)
      if (this.tableId != -1) {
        obj.id = this.tableId
      }

      scrmRadarArticleSave(obj).then((res) => {
        console.log(res)
        this.$router.push('/interactionRadar/index')
      })
    },
    handleTableChange ({ current, pageSize }) {
      this.medium.pagination.current = current
      this.medium.pagination.pageSize = pageSize
      this.getMedium()
    },
    // 上传图片
    async uploadPhoto (e) {
      console.log(e, '上传图片对象')
      if (e && e.target && e.target.files.length !== 0) {
        const file = e.target.files[0]
        const fileArray = file.name.split('.')
        const suffix = fileArray[fileArray.length - 1]
        if (!['jpg', 'jpeg', 'png'].includes(suffix)) {
          return this.$message.warn('请上传 JPG、JPEG及PNG格式的图片文件')
        }
        if (file.size > 10 * 1000 * 1000) {
          return this.$message.warn('请上传小于10MB的图片文件')
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        const res = await upLoad(formData)
        console.log(res)
        this.uploadUrl = res.data.fullPath
      } else {
        console.log(e)
      }
    },
    // 上传PDF
    async uploadPDF (e) {
      console.log(e, '上传pdf')
      // debugger
      if (e && e.target && e.target.files.length !== 0) {
        const file = e.target.files[0]
        if (file.size > 20 * 1000 * 1000) {
          return this.$message.warn('PDF文件大小不超过20M')
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('time', 1)
        console.log(formData, 'formData')
        const res = await upLoad(formData)
        console.log(res)
        this.uploadUrl = res.data.fullPath
        this.uploadName = res.data.name
      } else {
        console.log(e)
      }
    },
    // 上传视频
    async uploadVideo (e) {
      console.log(e, '上传视频')
      // debugger
      if (e && e.target && e.target.files.length !== 0) {
        const file = e.target.files[0]
        if (file.size > 300 * 1000 * 1000) {
          return this.$message.warn('请上传小于300MB的视频文件')
        }
        if (file.size < 10 * 1000 * 1000) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('time', 1)
          const res = await upLoad(formData)
          console.log(res)
          this.uploadUrl = res.data.fullPath
        } else {
          await mediaGetToken({ type: file.name }).then(res => {
            // console.log(res, '获取ossToken')
            this.oss = { ...res.data, key: res.data.key }
            this.dealUploadMethod(this.oss, file)
          }).catch(() => {
            this.$message.error('获取ossToken失败')
          })
        }
      } else {
        console.log(e)
      }
    },
    dealUploadMethod (info, fileInfo) {
      const tempFormData = new FormData()
      const index = this.selectIndex
      const shape = this.setData.inputData.shape
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      for (const i in info) {
        console.log(i, 'iii')
        tempFormData.append(i, info[i])
        if (shape == 5) {
          this.setData.inputData.uploadVideo[index][i] = info[i]
        }
      }
      if (shape == 5) {
        this.setData.inputData.uploadVideo[index].fileInfo = fileInfo
        tempFormData.append('file', fileInfo)
        this.modalState = false
        this.setData.inputData.uploadVideo[index].isUpload = true
        this.setData.inputData.uploadVideo[index].source = source
      } else {
        tempFormData.append('file', fileInfo)
        this.source = source
        this.isUpload = true
      }

      ossUpload({
        url: JSON.parse(sessionStorage.getItem('info')).ossUploadUrl,
        data: tempFormData,
        cancelToken: source.token }).then(res => {
        if (shape == 5) {
          this.setData.inputData.uploadVideo[index].video = `${info.host}/${info.key}` + '?1=1'
          this.setData.inputData.uploadVideo[index].isUpload = false
        } else {
          this.uploadUrl = `${info.host}/${info.key}` + '?1=1'
          this.isUpload = false
        }
      }).catch(() => {
        if (shape == 5 && this.setData.inputData.uploadVideo[index].source) {
          this.setData.inputData.uploadVideo[index].isError = true
        }
      })
    },
    getRadio (key, row) {
      console.log(key, row)
      this.radio.idArr = key
      this.radio.id = key[0]
      this.radio.content = row.content
    },
    getLink () {
      if (this.medium.type == 2) {
        this.$refs.uploadPhotoRef.value = ''
        this.$nextTick(() => {
          this.$refs['uploadPhotoRef'].click()
        })
      } else if (this.medium.type == 5) {
        this.$refs.uploadVideoRef.value = ''
        this.$nextTick(() => {
          this.$refs['uploadVideoRef'].click()
        })
      } else {
        this.$refs.uploadPDFRef.value = ''
        this.$nextTick(() => {
          this.$refs['uploadPDFRef'].click()
        })
      }
    },
    setModelTab (e) {
      this.modelTab = e
      if (e == 1) {
        this.getMedium()
      } else {
        this.radio = {
          id: -1,
          content: {},
          idArr: []
        }
      }
    },
    isUrl (val, type = 0) {
      // eslint-disable-next-line no-useless-escape
      const str = /^(http|https):\/\/[\S]+$/
      const wxStr = /^https:\/\/mp.weixin.qq.com\/s\/[\S]+/
      const reg = type == 0 ? new RegExp(str) : new RegExp(wxStr)
      return reg.test(val)
    },
    setCatalog () {
      const { id, content } = this.radio
      if (this.modelTab == 0) {
        if (this.medium.type == 2) {
          if (!this.isEditor) {
            this.setData.inputData[this.selectKey] = this.uploadUrl
          } else {
            this.$refs.editor[0].getEditorData('image', this.uploadUrl)
          }
          this.uploadUrl = ''
        } else if (this.medium.type == 5) {
          if (this.setData.inputData.shape == 5) {
            this.setData.inputData.uploadVideo[this.selectIndex].video = this.uploadUrl
          } else {
            if (this.source) {
              this.source.cancel()
              this.source = null
            }
            if (this.uploadUrl.length > 0) { this.$refs.editor[0].getEditorData('video', this.uploadUrl) }
          }
        } else {
          this.setData.inputData.radarPDF = this.uploadUrl
          this.setData.inputData.linkTitle = this.uploadName
        }
      } else {
        if (this.radio.id == -1) return this.$message.warn('至少选择一个选项')
        if (this.medium.type == 2) {
          if (!this.isEditor) {
            this.setData.inputData[this.selectKey] = content.imageFullPath
            this.radio = {
              id: -1,
              content: {},
              idArr: []
            }
            this.modelTab = 0
          } else {
            this.$refs.editor[0].getEditorData('image', content.imageFullPath)
          }
        } else if (this.medium.type == 3) {
          this.setData.inputData.linkImg = content.imageFullPath
          this.setData.inputData.linkTitle = content.title
          this.setData.inputData.linkDigest = content.description
          this.setData.inputData.articleLink = content.imageLink
          this.setData.inputData.materialId = id
        } else if (this.medium.type == 5) {
          console.log(content)
          if (this.setData.inputData.shape == 5) {
            this.setData.inputData.uploadVideo[this.selectIndex].video = content.videoFullPath
          } else {
            this.$refs.editor[0].getEditorData('video', content.videoFullPath)
          }
        } else {
          this.setData.inputData.radarPDF = content.fileFullPath
          this.setData.inputData.linkTitle = content.fileName
        }
      }
      this.radio = {
        id: -1,
        content: {},
        idArr: []
      }
      this.medium.data = []
      this.modelTab = 0
      this.uploadUrl = ''
      this.medium.pagination.current = 1
      this.medium.pagination.pageSize = 10
      this.selectKey = 'linkImg'
      this.modalState = false
    },
    editorChange (html) {
      // console.log(html)
      this.setData.inputData.content = html
    },
    setType (isState = true) {
      const { shape, contentSource } = this.setData.inputData
      const { inputType, articleArr, inputData } = this.setData
      const newInputType = inputType.concat(this.change[shape])
      if (shape == 3) {
        const articleType = newInputType.concat(articleArr[contentSource])
        console.log(articleType)
        this.$set(this.setData, 'changeType', articleType)
      } else {
        this.setData.inputData.contentSource = '0'
        this.$set(this.setData, 'changeType', newInputType)
      }
      const resetArr = ['linkImg', 'radarLink', 'linkTitle', 'linkDigest', 'content', 'articleLink']
      if (isState && inputData.shape != 5) {
        if (this.source) {
          this.source.cancel()
          this.source = null
        }
        resetArr.map(item => {
          this.setData.inputData[item] = ''
        })
      }
    },
    searchMedium () {
      this.medium.pagination.current = 1
      this.getMedium()
    },
    resetMedium () {
      this.medium.pagination.current = 1
      this.medium.pagination.pageSize = 10
      this.modelSearch = ''
      this.getMedium()
    },
    getMedium () {
      const { current, pageSize } = this.medium.pagination
      const obj = {
        page: current,
        perPage: pageSize,
        type: this.medium.type,
        searchStr: this.modelSearch
      }
      materialLibraryList(obj).then((res) => {
        const { page, list } = res.data
        console.log(res)
        this.medium.pagination.total = page.total
        this.medium.data = list.map((item) => {
          item.title = item.content.title
          return item
        })
      })
    },
    setMedium (e, isEditor = false, selectKey = 'linkImg', selectIndex = 0) {
      this.isEditor = isEditor
      this.isUpload = false
      const title = {
        2: {
          title: '上传图片'
        },
        3: {
          title: '选择图文'
        },
        5: {
          title: '上传视频'
        },
        7: {
          title: '上传PDF'
        }
      }
      console.log(this.setData)
      this.selectKey = selectKey
      this.selectIndex = selectIndex
      this.medium.type = e == -1 ? 2 : e
      this.modalTitle = e == -1 ? '上传图片' : title[e].title
      this.modalState = e != -1
      if (e == -1) {
        this.uploadUrl = ''
        this.medium.data = []
        this.modelTab = 0
        this.isImageText = false
        this.medium.pagination.current = 1
        this.medium.pagination.pageSize = 10
        if (this.source) {
          this.source.cancel()
          this.source = null
        }
      } else if (e == 3) {
        this.modelTab = 1
        this.isImageText = true
        this.getMedium()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setRadar_page {
  width: 100%;
  color: #333333;
  font-size: 14px;
  font-family: 'Arial Normal', 'Arial';
  font-weight: 400;
  font-style: normal;
  .setRadar_card {
    width: 100%;
    // min-height: 770px;
    box-sizing: border-box;
    padding: 20px 30px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 20px;
    .setRadar_content {
      width: 100%;
      .setRadar_title {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .content {
        width: 100%;
        .row {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .title {
            white-space: nowrap;
            margin-right: 10px;
            min-width: 70px;
            .icon {
              color: red;
            }
          }
          .import_box {
            display: flex;

            .input_box {
              position: relative;
              display: flex;
              flex-wrap: wrap;
              // align-items: center;
              .input {
                width: 200px;
                height: 40px;
                padding-right: 60px;
              }
              .hint {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(-50%, -50%);
              }
              .button {
                margin-top: 2px;
                margin-left: 20px;
              }
              .article {
                position: relative;
                top: 60px;
                left: -330px;
                margin-bottom: 100px;
                display: flex;
                box-sizing: border-box;
                padding: 10px;
                width: 260px;
                height: 80px;
                border-radius: 5px;
                border: 1px solid #ccc;
                .article_img {
                  width: 60px;
                  height: 60px;
                }

                .article_txt {
                  width: 165px;
                  white-space: pre-wrap;
                  margin-left: 10px;
                  .title {
                    color: #000;
                    font-weight: 800;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .content {
                    overflow: hidden;
                    white-space: nowrap;
                    width: 100%;
                    height: 40px;
                    text-overflow: ellipsis;
                  }
                }

                .close {
                  cursor: pointer;
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 18px;
                  height: 18px;
                  background-color: rgba(87, 85, 85, 0.7);
                  border-radius: 50%;
                  color: #fff;
                  transform: translate(50%, -50%) rotate(45deg);
                  font-size: 18px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }
            .select_box {
              .select {
                width: 200px;
                height: 40px;
              }
            }
            .checkbox_box {
              .checkbox {
                width: 200px;
                height: 40px;
              }
            }
            .cover_box {
              display: flex;
              align-items: flex-end;

              .cover_img_box {
                position: relative;
                width: 80px;
                height: 80px;
                .cover_img {
                  width: 100%;
                  height: 100%;
                }
                .show_box {
                  display: flex;
                  align-items: center;
                  box-sizing: border-box;
                  padding: 10px;
                  justify-content: space-between;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(74, 74, 74, 0.6);
                  color: #fff;
                  .btn {
                    cursor: pointer;
                    white-space: nowrap;
                  }
                }
              }

              .add_img_box {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 73px;
                height: 68px;
                background-color: #fff;
                border-radius: 5px;
                border: 1px solid #ccc;
                .add_icon {
                  width: 30px;
                  height: auto;
                }
              }
              .hint {
                margin-left: 20px;
                background-color: rgba(30, 159, 255, 0.2);
                padding: 10px;
                border-radius: 5px;
              }
            }
            .uploading_box {
              display: flex;
              .uploading_icon {
                cursor: pointer;
                width: auto;
                height: 36px;
              }

              .pdf_box {
                position: relative;
                width: 260px;
                height: 80px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 10px;
                .title {
                  height: 50px;
                  white-space: pre-wrap;
                }
                .icon {
                  width: 70px;
                  height: 70px;
                }
                .close {
                  cursor: pointer;
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 18px;
                  height: 18px;
                  background-color: rgba(87, 85, 85, 0.7);
                  border-radius: 50%;
                  color: #fff;
                  transform: translate(50%, -50%) rotate(45deg);
                  font-size: 18px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
              .hint {
                width: 180px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                margin-left: 20px;
                background-color: rgba(30, 159, 255, 0.2);
                border-radius: 5px;
              }
            }
            .quillEditor_box {
              position: relative;
              width: 100%;
              min-width: 800px;
              overflow: auto;
              display: flex;
              align-items: flex-end;

              .quillEditor {
                width: 650px;
                height: 350px;
              }
              .button {
                margin-left: 50px;
              }
            }
            .button_box {
              .article {
                position: relative;
                margin-top: 20px;
                display: flex;
                box-sizing: border-box;
                padding: 10px;
                width: 260px;
                height: 80px;
                border-radius: 5px;
                border: 1px solid #ccc;
                .article_img {
                  width: 60px;
                  height: 60px;
                }

                .article_txt {
                  width: 165px;
                  white-space: pre-wrap;
                  margin-left: 10px;
                  .title {
                    color: #000;
                    font-weight: 800;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .content {
                    overflow: hidden;
                    white-space: nowrap;
                    width: 100%;
                    height: 40px;
                    text-overflow: ellipsis;
                  }
                }

                .close {
                  cursor: pointer;
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 18px;
                  height: 18px;
                  background-color: rgba(87, 85, 85, 0.7);
                  border-radius: 50%;
                  color: #fff;
                  transform: translate(50%, -50%) rotate(45deg);
                  font-size: 18px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }
            .bgImg_box {
              flex-shrink: 0;
              position: relative;
              min-width: 480px;
              min-height: 200px;
              .radio {
                height: 100%;
                display: flex;
                flex-direction: column;
                label {
                  margin-top: 20px;
                }
              }
              .btn_box {
                position: absolute;
                bottom: 118px;
                right: 0;
                display: flex;
                align-items: center;
                .btn {
                  margin-right: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;

                  .text {
                    cursor: pointer;
                    min-width: 86px;
                    height: 21px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #1c96f0;
                    color: #1c96f0;
                    padding: 0 10px;
                    box-sizing: border-box;
                    white-space: nowrap;
                    border-radius: 5px;
                  }
                  .upload {
                    display: flex;
                    align-items: center;
                    height: 0;
                    transform: translateY(55px);
                    .cover_img_box {
                      position: relative;
                      width: 80px;
                      height: 80px;
                      .cover_img {
                        width: 100%;
                        height: 100%;
                      }
                      .show_box {
                        display: flex;
                        align-items: center;
                        box-sizing: border-box;
                        padding: 0px;
                        justify-content: space-between;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(74, 74, 74, 0.6);
                        color: #fff;
                        .btn {
                          cursor: pointer;
                          white-space: nowrap;
                        }
                      }
                    }

                    .add_img_box {
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 73px;
                      height: 68px;
                      background-color: #fff;
                      border-radius: 5px;
                      border: 1px solid #ccc;
                      .add_icon {
                        width: 30px;
                        height: auto;
                      }
                    }
                  }
                }
              }
            }
            .uploadVideo {
              display: flex;
              flex-wrap: wrap;
              .video_box {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 20px;
                margin-bottom: 20px;
                .upload_box {
                  margin-bottom: 10px;
                }
                .cover_video_box {
                  width: 80px;
                  height: 80px;
                  position: relative;
                  .close {
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transform: translate(50%, -50%);
                  }
                  .cover_video {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    .spin {
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    }
                  }
                  .reupload {
                    cursor: pointer;
                    width: 100%;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    background-color: rgba(85, 85, 85);
                    opacity: 0.8;
                    color: #fff;
                    font-family: 'Arial Normal', 'Arial';
                    font-weight: 400;
                    font-style: normal;
                    font-size: 13px;
                  }
                }
                .add_img_box {
                  position: relative;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 80px;
                  height: 80px;
                  background-color: #fff;
                  border-radius: 5px;
                  border: 1px solid #ccc;
                  .add_icon {
                    width: 30px;
                    height: auto;
                  }
                  .index {
                    font-family: 'Arial Normal', 'Arial';
                    font-weight: 400;
                    font-style: normal;
                    font-size: 28px;
                    position: absolute;
                    bottom: 0px;
                    right: 5px;
                  }
                }
              }
              .btn_box {
                box-sizing: border-box;
                display: flex;
                align-items: flex-end;
                padding-bottom: 20px;
              }
            }
          }
        }
      }
    }
  }
  .setRadar_link {
    margin-top: 25px;
    width: 100%;
    // min-height: 770px;
    box-sizing: border-box;
    padding: 20px 30px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 20px;
    .setRadar_title {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .setRadar_content {
      display: flex;
      flex-direction: column;
      .checkbox_box {
        display: flex;
        flex-direction: column;
        ::v-deep(.ant-checkbox-wrapper) {
          margin-bottom: 10px;
        }
      }
      .select_box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .select {
          width: 140px;
          height: 40px;
          margin: 0 20px 20px 0;
          cursor: pointer;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
        }
        .tabs {
          margin: 0 35px 20px 0;
          position: relative;
          min-width: 86px;
          padding: 0 10px;
          height: 40px;
          border: 1px solid rgb(129, 211, 248);
          display: flex;
          align-items: center;
          justify-content: center;
          .empty {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background-color: rgba(87, 85, 85, 0.7);
            border-radius: 50%;
            color: #fff;
            transform: translate(50%, -50%) rotate(45deg);
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
.model_input_box {
  width: 700px;
  height: 490px;
  .model_tab_box {
    width: 100%;
    height: 50px;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    .model_tab {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 20px;
      cursor: pointer;
    }
  }
  .model_content {
    height: 440px;
    overflow: auto;
    .upload_box {
      margin-top: 10px;
      width: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .span {
        width: 200px;
        height: 200px;
      }

      .hint {
        margin-top: 90px;
        .text {
          margin-bottom: 20px;
          p {
            width: 100%;
            margin: 0;
          }
        }
      }

      .upload_btn {
        width: 115px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #1c96f0;
        border-radius: 5px;
        color: #fff;
        .upload_icon {
          margin-right: 5px;
          height: 15px;
          width: auto;
        }
      }

      .upload_image {
        cursor: pointer;
        width: 350px;
        height: auto;
      }
      .pdf_box {
        cursor: pointer;
        width: 260px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;
        .title {
          height: 50px;
        }
        .icon {
          width: 70px;
          height: 70px;
        }
      }
    }
    .material_library_box {
      width: 100%;
      height: 440px;
      overflow: auto;
      .search_box {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 18px;
        .hint {
          margin-bottom: 8px;
        }
        .seach {
          display: flex;
          align-items: center;
          .input {
            width: 165px;
            height: 25px;
          }
          .button {
            width: auto;
            height: 25px;
          }
        }
      }
    }
  }
}
.preview_box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .content_box {
    position: absolute;
    background-color: #fff;
    width: 350px;
    height: 700px;
    overflow: auto;
  }
  .over_box {
    position: absolute;
    top: 60px;
    background-color: #f3faff;
    width: 350px;
    height: 730px;
    overflow: auto;
  }
  .templateVideo_box {
    background-color: #f3faff;
    width: 100%;
    min-height: 750px;
    box-sizing: border-box;
    .header {
      width: 100%;
      height: auto;
    }
    .video_box {
      width: 100%;
      min-height: 540px;
      background: url('../../assets/default_bg.png') 100% 100% no-repeat;
      background-size: 100% 100%;
      .video {
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-family: '獅尾四季春加糖JP-Medium, 獅尾四季春加糖JP';
          font-weight: 500;
          color: #ffffff;
          line-height: 38px;
          width: 322px;
          height: 40px;
          background: url('../../assets/default_title.png') no-repeat 0px 0px;
          background-size: 100%;
        }
        .content {
          position: relative;
          margin-top: 8px;
          margin-bottom: 25px;

          .vertical {
            position: absolute;
            top: 13px;
            left: 12px;
            width: 301px;
            height: 158px;
            background-color: #fff;
          }
          .row {
            position: absolute;
            top: 11px;
            left: 18px;
            width: 214px;
            height: 409px;
            background-color: #fff;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      height: auto;
    }
  }
}
::v-deep(.ant-modal-header) {
  font-size: 14px;
  text-align: start;
  font-family: 'Arial Normal', 'Arial';
  font-weight: 400;
  color: #333333;
  background-color: #e9e9e9;
}

::v-deep(.ant-modal-body) {
  padding: 0;
  .box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
