<template>
  <div class="internal">
    <div class="flex" style="align-items: start">
      <a-card class="left-card">
        <div class="top-title">接入企业微信步骤</div>
        <!--  showIndex    1-->
        <div class="step-1">
          <div class="step-row" :class="[stepIndex==1?'showStepRow':'']">
            <div class="step-index" :class="[stepIndex==1?'showIndex':'']">1</div>
            配置企业微信账号
          </div>
          <div class="step-name" :class="[stepIndex==1&&showStep==1?'stepName':'']">1.输入企业ID和名称</div>
        </div>
        <!--      2-->
        <div class="step-1">
          <div class="step-row" :class="[stepIndex==2?'showStepRow':'']">
            <div class="step-index" :class="[stepIndex==2?'showIndex':'']">2</div>
            配置自建应用
          </div>
          <div class="step-name" :class="[stepIndex==2&&showStep==1?'stepName':'']">1.自建应用代开发授权</div>
        </div>
        <!--      3-->
        <div class="step-1">
          <div class="step-row" :class="[stepIndex==3?'showStepRow':'']">
            <div class="step-index" :class="[stepIndex==3?'showIndex':'']">3</div>
            配置企业通讯录
          </div>
          <div class="step-name" :class="[stepIndex==3&&showStep==1?'stepName':'']">1.输入通讯录Secret</div>
          <div class="step-name" :class="[stepIndex==3&&showStep==2?'stepName':'']">2.设置接收事件服务器</div>
        </div>
        <!--      4-->
        <div class="step-1">
          <div class="step-row" :class="[stepIndex==4?'showStepRow':'']">
            <div class="step-index" :class="[stepIndex==4?'showIndex':'']">4</div>
            配置客户联系
          </div>
          <div class="step-name" :class="[stepIndex==4&&showStep==1?'stepName':'']">1.输入客户联系Secret</div>
          <div class="step-name" :class="[stepIndex==4&&showStep==2?'stepName':'']">2.设置接收事件服务器</div>
          <div class="step-name" :class="[stepIndex==4&&showStep==3?'stepName':'']">3.设置客户联系使用范围</div>
        </div>
        <!--      5-->
        <div class="step-1">
          <div class="step-row" :class="[stepIndex==5?'showStepRow':'']">
            <div class="step-index" :class="[stepIndex==5?'showIndex':'']">5</div>
            配置工作台和侧边栏
          </div>
          <div class="step-name" :class="[stepIndex==5&&showStep==1?'stepName':'']">1.配置网页授权JS-SDK</div>
          <div class="step-name" :class="[stepIndex==5&&showStep==2?'stepName':'']">2.配置工作台主页</div>
          <div class="step-name" :class="[stepIndex==5&&showStep==3?'stepName':'']">3.配置聊天侧边栏</div>
        </div>
      </a-card>
      <a-card class="right-card">
        <!--      <div class="show-step-cont">-->
        <!--    设置企业ID、名称-->
        <div v-show="stepIndex==1">
          <div class="cont-box" style="display: flex;">
            <div class="row-title">输入企业微信ID和企业名称</div>
          </div>
          <a-divider/>
          <div class="show-step-cont">
            <div class="cont-box">
              <div class="set-tips">
                <div>配置企业微信ID和企业微信名称是使用本系统的必须条件，不配置本系统所有功能都无法正常使用。</div>
                <div>企业微信ID为你注册企业微信的时候企业微信官方为每个账号分配的唯一标示“CorpID”，企业名称为你的企业微信简称。</div>
                <div>将该两项填入下方输入框，即完成企业微信账号的接入。</div>
              </div>
              <div class="set-cont">
                <div class="row-name">企业名称：</div>
                <a-input placeholder="请输入企业名称" v-model="step1AskData.corpName" style="calc(100% - 130px)"/>
              </div>
              <div class="set-cont">
                <div class="row-name">企业ID：</div>
                <a-input placeholder="请输入ID" v-model="step1AskData.wxCorpId" style="calc(100% - 130px)"/>
              </div>
            </div>
          </div>
        </div>
        <!--    创建自建应用  -->
        <div v-show="stepIndex==2">
          <!--        第一步引导-->
          <div v-show="showStep==1">
            <div class="cont-box">
              <div class="row-title">授权自建应用代开发</div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <a-alert
                message="请企业微信管理员使用企业微信账号扫描下方二维码完成代开发授权操作！"
                type="info"
                class="mb16"
                style="width: 60%;"
              />
              <div class="flex" style="justify-content: center">
                <a-steps v-model="auth.step" style="width: 90%;">
                  <a-step :title="auth.step > 0 ? '已完成' : '未完成'" description="扫码授权"/>
                  <a-step :title="auth.step > 1 ? '已完成' : '未完成'" description="配置应用"/>
                  <a-step :title="auth.step >= 2 ? '已完成' : '未完成'" description="发布应用"/>
                </a-steps>
              </div>
              <div v-if="auth.step === 0">
                <div class="qr-img" ref="qrCode">
                </div>
                <div class="mt18 flex fz20" style="justify-content: center">
                  <span v-if="!auth.scanCodeFlag">
                    <a-icon type="info-circle" class="mr6"/>
                    未扫码
                  </span>
                  <span v-else>
                    <a-icon type="check-circle" class="mr6"/>
                    已扫码
                  </span>
                </div>
              </div>
              <div v-if="auth.step === 1">
                <div class="flex mt50 mb32" style="justify-content: center">
                  <a-spin size="large"/>
                </div>
                <div class="mt18 flex fz20" style="justify-content: center">
                  <span v-if="!auth.configFlag">
                    <a-icon type="info-circle" class="mr6"/>
                    员工正在配置中，预计需要5-10分钟，请稍候。如长时间无响应，请联系员工！
                    <br/>
                    当前企业Id：{{ corpId }}，应用ID：{{ agentId }}
                  </span>
                  <span v-else>
                    <a-icon type="check-circle" class="mr6"/>
                    服务商配置完成
                    <br/>
                    当前企业Id：{{ corpId }}，应用ID：{{ agentId }}
                  </span>
                </div>
              </div>
              <div v-if="auth.step === 2">
                <div class="flex mt50 mb32" style="justify-content: center" v-if="!auth.pushFlag">
                  <a-spin size="large"/>
                </div>
                <div class="mt18 flex fz20" style="justify-content: center">
                  <span v-if="!auth.pushFlag">
                    <a-icon type="info-circle" class="mr6"/>
                    服务商待发布应用
                  </span>
                  <span v-else>
                    <a-icon type="check-circle" class="mr6"/>
                    自建应用代开发已发布成功，请继续下一步配置流程
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--      配置企业通讯录-->
        <div v-show="stepIndex==3">
          <div v-show="showStep==1">
            <div style="display: flex;justify-content:space-between;">
              <div style="display: flex;">
                <div class="row-title">输入通讯录Secret</div>
              </div>
              <div>
                <a-radio-group v-model="selectModel.step3">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>通讯录Secret配置好后，系统才能同步通讯录成员及组织架构等数据，所以无论如何也要保证配置正确，否则会影响数据的同步和系统的使用。</div>
                </div>
                <div v-if="selectModel.step3==2">
                  <div class="set-tips set-tips-row">1、从在管理工具页面，点击【通讯录同步】</div>
                  <img src="@/assets/corpConfig/u814.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">2、按一下步骤，获取通讯录【Secret】对应信息，填入下方输入框</div>
                  <img src="@/assets/corpConfig/u816.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u828.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u818.png" alt="" style="width: 100%;margin-top: 20px;">
                </div>
                <div class="set-cont">
                  <div class="row-name">通讯录Secret：</div>
                  <a-input placeholder="请输入通讯录对应的Secret" v-model="employeeSecret" style="calc(100% - 130px)"/>
                </div>
              </div>
            </div>
          </div>
          <div v-show="showStep==2">
            <div style="display: flex;justify-content:space-between;">
              <div class="row-title">设置通讯录接收事件服务器</div>
              <div>
                <a-radio-group v-model="selectModel.step3Index2">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>通讯录Secret配置好后，系统才能同步通讯录成员及组织架构等数据，所以无论如何也要保证配置正确，否则会影响数据的同步和系统的使用。</div>
                </div>
                <div v-if="selectModel.step3Index2==2">
                  <div class="set-tips set-tips-row">1、从在管理工具页面，点击【通讯录同步】</div>
                  <img src="@/assets/corpConfig/u814.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">2、获取编辑接收事件服务器的权限</div>
                  <img src="@/assets/corpConfig/u1017.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1019.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1054.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1021.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">3、将下面信息填到对应的输入框，然后点保存即可</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">URL：</div>
                  <div class="row-cont">{{ eventData.eventCallback }}</div>
                  <div class="copy-btn" @click="copyLink(eventData.eventCallback)">复制</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">Token：</div>
                  <div class="row-cont">{{ eventData.token }}</div>
                  <div class="copy-btn" @click="copyLink(eventData.token)">复制</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">EncodingAESKey：</div>
                  <div class="row-cont">{{ eventData.encodingAesKey }}</div>
                  <div class="copy-btn" @click="copyLink(eventData.encodingAesKey)">复制</div>
                </div>
                <img
                  src="@/assets/corpConfig/u1023.png"
                  v-if="selectModel.step3Index2==2"
                  alt=""
                  style="width: 100%;margin-top: 20px;">
              </div>
            </div>
          </div>
        </div>
        <!--      配置客户联系-->
        <div v-show="stepIndex==4">
          <div v-show="showStep==1">
            <div style="display: flex;justify-content:space-between;">
              <div style="display: flex;">
                <div class="row-title">输入客户联系Secret</div>
              </div>
              <div>
                <a-radio-group v-model="selectModel.step4">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>客户联系Secret配置好后，系统才能同步客户和客户群等相关数据和调用客户联系的API能力，所以无论如何也要保证配置正确，否则会影响数据的同步和系统的使用。</div>
                </div>
                <div v-if="selectModel.step4==2">
                  <div class="set-tips set-tips-row">1、在【客户联系】页面上方点击【API】按钮，展开配置模块</div>
                  <img src="@/assets/corpConfig/u632.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">2、按以下步骤，获取客户联系【Secret】对应信息，填入下方输入框</div>
                  <img src="@/assets/corpConfig/u1221.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1223.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1235.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1225.png" alt="" style="width: 100%;margin-top: 20px;">
                </div>
                <div class="set-cont">
                  <div class="row-name">客户联系Secret：</div>
                  <a-input placeholder="请输入客户联系对应的Secret" v-model="contactSecret" style="calc(100% - 130px)"/>
                </div>
              </div>
            </div>
          </div>
          <div v-show="showStep==2">
            <div style="display: flex;justify-content:space-between;">
              <div class="row-title">设置客户联系接收事件服务器</div>
              <div>
                <a-radio-group v-model="selectModel.step4Index2">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>客户联系Secret配置好后，系统才能同步客户和客户群等相关数据和调用客户联系的API能力，所以无论如何也要保证配置正确，否则会影响数据的同步和系统的使用。</div>
                </div>
                <div v-if="selectModel.step4Index2==2">
                  <div class="set-tips set-tips-row">1、在【客户联系】页面上方点击【API】按钮，展开配置模块</div>
                  <img src="@/assets/corpConfig/u632.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">2、获取编辑接收事件服务器的权限</div>
                  <img src="@/assets/corpConfig/u1457.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1019.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1054.png" alt="" style="width: 100%;margin-top: 20px;">
                  <img src="@/assets/corpConfig/u1021.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">3、将下面信息填到对应的输入框，然后点保存即可</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">URL：</div>
                  <div class="row-cont">{{ eventData.eventCallback }}</div>
                  <div class="copy-btn" @click="copyLink(eventData.eventCallback)">复制</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">Token：</div>
                  <div class="row-cont">{{ eventData.token }}</div>
                  <div class="copy-btn" @click="copyLink(eventData.token)">复制</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">EncodingAESKey：</div>
                  <div class="row-cont">{{ eventData.encodingAesKey }}</div>
                  <div class="copy-btn" @click="copyLink(eventData.encodingAesKey)">复制</div>
                </div>
                <img
                  src="@/assets/corpConfig/u1459.png"
                  v-if="selectModel.step4Index2==2"
                  alt=""
                  style="width: 100%;margin-top: 20px;">
              </div>
            </div>
          </div>
          <div v-show="showStep==3">
            <div class="cont-box">
              <div class="row-title">设置客户联系使用范围</div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>只有配置的客户联系使用权限范围的员工才能通外部客户沟通，并使用系统的的能力。</div>
                </div>
                <div class="set-tips set-tips-row">1、在【我的企业】页面，点击左侧【外部沟通管理】</div>
                <img src="@/assets/corpConfig/u1614.png" alt="" style="width: 100%;margin-top: 20px;">
                <div class="set-tips set-tips-row">2、设置客户联系使用范围，点击确认，建议给所有人都有客户联系权限，避免一些因权限产生的意外问题</div>
                <img src="@/assets/corpConfig/u1616.png" alt="" style="width: 100%;margin-top: 20px;">
                <img src="@/assets/corpConfig/u1618.png" alt="" style="width: 100%;margin-top: 20px;">
              </div>
            </div>
          </div>
        </div>
        <!--      配置聊天侧边栏-->
        <div v-show="stepIndex==5">
          <!--        设置网页授权js-sdk-->
          <div v-show="showStep==1">
            <div style="display: flex;justify-content:space-between;">
              <div class="row-title">配置网页授权JS-SDK</div>
              <div>
                <a-radio-group v-model="selectModel.step5">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>自建应用代开发此步可跳过。</div>
                </div>
              </div>
            </div>
          </div>
          <!--        配置客户/群画像-->
          <div v-show="showStep==2">
            <div style="display: flex;justify-content:space-between;">
              <div style="display: flex;">
                <div class="row-title">配置工作台主页</div>
              </div>
              <div>
                <a-radio-group v-model="selectModel.step5Index2">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>开通成功后，登录企业微信，点击工作台中对应的应用图标，点击开始使用后即可使用</div>
                </div>
                <div v-if="selectModel.step5Index2==2">
                  <div class="set-tips set-tips-row">1、在应用管理【自建应用模块】，找到刚刚创建的【自建应用】，点击进入应用详情页</div>
                  <img src="@/assets/corpConfig/u271.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">2、在应用详情页-找到【应用主页】，点击设置</div>
                  <div class="set-tips set-tips-row">3、配置应用主页，将下面信息填到对应输入框，点击确定完成配置</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">名称：</div>
                  <div class="row-cont">工作台主页</div>
                </div>
                <div class="set-cont">
                  <div class="row-name">页面URL：</div>
                  <div class="row-cont">{{ workbench }}</div>
                  <div class="copy-btn" @click="copyLink(workbench)">复制</div>
                </div>
                <img src="@/assets/corpConfig/u2070.png" v-if="selectModel.step5Index2==2" alt="" style="width: 100%;margin-top: 20px;">
              </div>
            </div>
          </div>
          <!--        配置素材库-->
          <div v-show="showStep==3">
            <div style="display: flex;justify-content:space-between;">
              <div style="display: flex;">
                <div class="row-title">配置聊天侧边栏</div>
              </div>
              <div>
                <a-radio-group v-model="selectModel.step5Index3">
                  <a-radio :value="1">专业模式</a-radio>
                  <a-radio :value="2">引导模式</a-radio>
                </a-radio-group>
              </div>
            </div>
            <a-divider/>
            <div class="show-step-cont">
              <div class="cont-box">
                <div class="set-tips">
                  <div>帮助企业高效的与客户沟通，支持添加文字、图片、外链、图文链接、第三方链接等多类型消息，可对消息进行分类方便管理与查找，同时支持一键发送，帮助企业员工提高工作效率</div>
                </div>
                <div v-if="selectModel.step5Index3==2">
                  <div class="set-tips set-tips-row">1、在应用管理【自建应用模块】，找到刚刚创建的【自建应用】，点击进入应用详情页</div>
                  <img src="@/assets/corpConfig/u271.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">2、在应用详情页-功能板块-找到【配置到聊天工具栏】，点击配置</div>
                  <img src="@/assets/corpConfig/u2050.png" alt="" style="width: 100%;margin-top: 20px;">
                  <div class="set-tips set-tips-row">3、配置以下多个聊天侧边栏，将下面信息依次填到对应输入框，点击确定完成配置</div>
                  <img src="@/assets/corpConfig/u2052.png" alt="" style="width: 100%;margin-top: 20px;">
                </div>
                <div v-for="(item, index) in sidebar" :key="index">
                  <div class="set-cont">
                    <div class="row-name">页面名称{{ index + 1 }}：</div>
                    <div class="row-cont">{{ item.name }}</div>
                  </div>
                  <div class="set-cont">
                    <div class="row-name">页面URL：</div>
                    <div class="row-cont">{{ item.url }}</div>
                    <div class="copy-btn" @click="copyLink(item.url)">复制</div>
                  </div>
                </div>
                <img src="@/assets/corpConfig/u2070.png" v-if="selectModel.step5Index3==2" alt="" style="width: 100%;margin-top: 20px;">
              </div>
            </div>
          </div>
        </div>
        <!--  下一步  -->
        <a-divider/>
        <div class="foot-btn">
          <a-button type="primary" @click="saveBtn" :disabled="saveButtonDisabled">{{ saveButtonText }}</a-button>
          <a-button
            type="primary"
            style="margin-left: 20px;"
            v-if="(stepIndex==3&&showStep==2)||(stepIndex==4&&showStep==2)"
            @click="getEventServer(2)"
          >重新获取
          </a-button>
        </div>
      </a-card>
    </div>
    <input type="text" class="copy-input" ref="copyInput">
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {
  storeApi,
  userSecretStoreApi,
  callbackInfoApi,
  contactSecretStoreApi,
  getAuthQrCode,
  getPublishStatus,
  agentInfoApi
} from '@/api/corp'
import QRCode from 'qrcodejs2'

export default {
  data () {
    return {
      stepIndex: 1,
      showStep: 1,
      corpId: '',
      agentId: 0,
      // 选择引导模式
      selectModel: {
        step2: 2,
        step3: 2,
        step3Index2: 2,
        step4: 2,
        step4Index2: 2,
        step5: 2,
        step5Index2: 2,
        step5Index3: 2
      },
      // 接受事件服务器详情
      eventData: {},
      // 第一步请求数据
      step1AskData: {
        wxCorpId: '',
        corpName: '',
        authType: 2
      },
      //  第二步请求数据
      step2Data: {
        agentId: 0,
        wxAgentId: '',
        wxSecret: ''
      },
      //  第三步请求数据
      employeeSecret: '',
      //  第四步请求数据
      contactSecret: '',
      //  第五步
      //  客户画像请求数据
      contactPortrait: {
        wxAgentId: '',
        wxSecret: ''
      },
      //  素材库自建应用
      materialLibrary: {
        wxAgentId: '',
        wxSecret: ''
      },
      saveButtonDisabled: false,
      saveButtonText: '保存，进入下一步',
      auth: {
        step: 0,
        scanCodeFlag: false,
        configFlag: false,
        pushFlag: false,
        qrCodeUrl: '',
        checkTimer: null
      },
      sidebar: [],
      workbench: ''
    }
  },
  methods: {
    scanCodeConfirm () {
      this.auth.step++

      setTimeout(() => {
        this.auth.configFlag = true
        this.auth.step++
      }, 2000)
    },

    // 复制
    copyLink (data) {
      const inputElement = this.$refs.copyInput
      inputElement.value = data
      inputElement.select()
      document.execCommand('Copy')
      this.$message.success('复制成功')
    },
    getEventServer (type) {
      callbackInfoApi({
        corpId: this.corpId,
        type
      }).then((res) => {
        this.eventData = res.data
      })
    },
    // 加载二维码
    initQRCode (link) {
      this.$refs.qrCode.innerHTML = ''
      // eslint-disable-next-line no-new
      new QRCode(this.$refs.qrCode, {
        text: link,
        width: 200,
        height: 200
      })
    },
    checkAuthStatus () {
      clearInterval(this.auth.checkTimer)
      this.auth.checkTimer = null
      this.auth.checkTimer = setInterval(() => {
        getPublishStatus().then((res) => {
          if (res.data.publishStatus === 0) {
            this.auth.step = 0
            this.auth.scanCodeFlag = false
            this.auth.configFlag = false
            this.auth.pushFlag = false
          } else if (res.data.publishStatus === 1) {
            if (this.$refs.qrCode) {
              this.$refs.qrCode.innerHTML = ''
            }
            this.agentId = res.data.agentId
            this.auth.step = 1
            this.auth.scanCodeFlag = true
            this.auth.configFlag = false
            this.auth.pushFlag = false
          } else if (res.data.publishStatus === 2) {
            if (this.$refs.qrCode) {
              this.$refs.qrCode.innerHTML = ''
            }
            this.agentId = res.data.agentId
            this.auth.step = 2
            this.auth.scanCodeFlag = true
            this.auth.configFlag = true
            this.auth.pushFlag = true
            this.saveButtonDisabled = false
            this.saveButtonText = '已完成授权，可进入下一步'
            this.$message.info('自建应用代开发已配置完成，请继续下一步配置流程')
            clearInterval(this.auth.checkTimer)
            this.auth.checkTimer = null
            agentInfoApi({
              corpId: this.corpId,
              type: 1
            }).then((res) => {
              this.sidebar = res.data.sidebar
              this.workbench = res.data.workbench
            })
          }
        })
      }, 3000)
    },
    saveBtn () {
      //  配置企业微信账号
      if (this.stepIndex == 1) {
        if (this.step1AskData.corpName == '') {
          this.$message.warning('请设置企业名称')
          return false
        }
        if (this.step1AskData.wxCorpId == '') {
          this.$message.warning('请输入企业ID')
          return false
        }
        storeApi(this.step1AskData).then((res) => {
          this.corpId = res.data[0]
          // 获取接收事件服务器
          this.getEventServer(1)
          this.$message.success('创建成功')
          getAuthQrCode({}).then((res) => {
            this.stepIndex++
            this.saveButtonDisabled = true
            this.saveButtonText = '未完成授权，不可进入下一步'
            this.showStep = 1
            this.initQRCode(res.data.url)
            this.checkAuthStatus()
          })
          return false
        })
      }
      // 创建自建应用
      if (this.stepIndex == 2) {
        if (this.showStep == 1) {
          if (this.auth.step !== 2 && this.auth.pushFlag !== true) {
            this.$message.warning('请完成发布应用后继续')

            return false
          }

          this.showStep = 1
          this.stepIndex++
          return false
        }
      }
      // 配置企业通讯录
      if (this.stepIndex == 3) {
        if (this.showStep == 1) {
          if (this.employeeSecret == '') {
            this.$message.warning('请输入企业通讯录对应的Secret')
            return false
          }
          userSecretStoreApi({
            corpId: this.corpId,
            employeeSecret: this.employeeSecret
          }).then((res) => {
            this.showStep++
            return false
          })
        }
        if (this.showStep == 2) {
          this.stepIndex++
          this.showStep = 1
          return false
        }
      }
      // 配置客户联系
      if (this.stepIndex == 4) {
        if (this.showStep == 1) {
          if (this.contactSecret == '') {
            this.$message.warning('请输入客户联系对应的Secret')
            return false
          }
          contactSecretStoreApi({
            corpId: this.corpId,
            contactSecret: this.contactSecret
          }).then((res) => {
            this.showStep++
            return false
          })
        }
        if (this.showStep == 2) {
          this.showStep++
          return false
        }
        if (this.showStep == 3) {
          this.stepIndex++
          this.showStep = 1
          return false
        }
      }
      //  配置聊天侧边栏
      if (this.stepIndex == 5) {
        if (this.showStep == 1) {
          this.showStep++
          return false
        }
        if (this.showStep == 2) {
          this.showStep++
          return false
        }
        if (this.showStep == 3) {
          this.$message.success('创建成功')
          this.stepIndex = 1
          this.showStep = 1
          this.$router.push({ path: '/corp/configManage' })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.qr-img {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 56px;

  img {
    width: 200px;
    height: 200px;
  }
}

.page-style {
  width: 100%;
  height: calc(100vh - 180px);
  display: flex;
}

.copy-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -10;
}

.cont-box {
  width: 50%;
  min-width: 750px;
}

.row-title {
  font-weight: bold;
  border-left: 4px solid #0066FF;
  padding-left: 10px;
  height: 18px;
  line-height: 18px;
}

.set-tips {
  background: #EEF9FF;
  padding: 15px 25px;
  color: #6B6B6B;
}

.set-tips-row {
  font-weight: bold;
  font-size: 15px;
  color: #000;
  margin-top: 22px;
}

.set-cont {
  display: flex;
  margin-top: 25px;

  .row-name {
    width: 135px;
    line-height: 30px;
    text-align: right;
  }
}

.foot-btn {
  margin-top: 20px;
}

.row-cont {
  width: 500px;
  height: 30px;
  background: #FBFBFB;
  border: 1px solid #E4E4E4;
  padding-left: 7px;
  line-height: 28px;
  font-size: 13px;
}

.copy-btn {
  border: 1px solid #B4F0B1;
  background: #F6FFF6;
  line-height: 26px;
  margin-left: 15px;
  padding: 0 18px;
  font-size: 13px;
  cursor: pointer;
  height: 28px;
  margin-top: 2px;
  border-radius: 2px;
}

.right-card {
  width: calc(100% - 260px);
  height: calc(100vh - 140px);
  margin-left: 10px;
}

.show-step-cont {
  overflow-y: auto;
  height: calc(100vh - 370px);
}

.card-box {
  width: 100%;
  height: 100%;
}

.left-card {
  width: 250px;
  height: calc(100vh - 140px);
  overflow-y: auto;

  .top-title {
    font-size: 17px;
    font-weight: bold;
  }

  .step-row {
    display: flex;
    margin-top: 15px;
    padding: 10px 10px;
  }

  .showStepRow {
    background: #E7F7FF;
  }

  .step-index {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #949494;
    text-align: center;
    line-height: 20px;
    font-weight: bold;
    color: #fff;
    margin-right: 5px;
  }

  .showIndex {
    background: #1690FF;
  }

  .step-name {
    padding-left: 15px;
    margin-top: 8px;
  }

  .stepName {
    color: #5266FF;
  }
}
</style>
