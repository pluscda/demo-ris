/* eslint-disable no-empty */
<template>
	<div id='FI0301' class="pageContent pb-1">
		<b-card no-body class='mx-1'>
			<b-card-header class="bg-warning text-dark cardHeader btn-right">
          <toggle-button ref="toggleView" @change="showDetails = !showDetails" :value="showDetails" class="detail-btn" color="#dc3545" :font-size="14" :height="24" :width="100"
               :labels="{checked: '顯示詳情', unchecked: '顯示詳情'}"/>
				<b-row no-gutters>
					<b-col cols="6" class="float-left text-left font-weight-bold">報告撰寫作業</b-col>
					<b-col cols="6" class="float-right text-right">
					
						<b-dropdown id="dropdown-1" text="背景更換" dropleft style="font-size:12px;" >
							<b-dropdown-item :active="isWhite" class="bg-clr" @click="bgUpdate('white', $event)">白色</b-dropdown-item>
							<b-dropdown-item :active="isBlack" class="bg-clr" @click="bgUpdate('black', $event)">黑色</b-dropdown-item>
							<b-dropdown-item :active="isGray" class="bg-clr" @click="bgUpdate('#868e96', $event)">灰色</b-dropdown-item>
  						</b-dropdown>
						<!--
							當要用 free regular icon 時:
							1. fontawesome.js 內得加載 @fortawesome/free-regular-svg-icons
							2. 得用 :icon 並加註 'far'
						<font-awesome-icon :icon="['far', 'circle']" class='mr-2 text-black cursor-pointer' @click='ThemeSwitch'/>
						-->
						<!--
						<font-awesome-icon icon="keyboard" class='mr-1'/>
						-->
            <font-awesome-icon icon="cog" :disabled="!HotkeyList.length" class='mr-2 text-black cursor-pointer' @click='WinConfigOpen' />
						<font-awesome-icon icon="question" class='mr-1 cursor-pointer' hidden @click='HelpShow'/>
					</b-col>
				</b-row>
			</b-card-header>
			<b-card-text class='text-left py-1 m-0'>
        <b-container fluid class='px-0'>
					<b-row no-gutters class="first-row">
						<b-col sm='2' class='px-1'>
							<b-input-group prepend='優先順序'>
								<template v-slot='append'>
									<b-radio-group tag="EmgFlag"  name="CaseEmergency" v-model='casePriorityCode' :options='OptionsCasePriority' buttons button-variant='outline-danger'>
									</b-radio-group>
								</template>
							</b-input-group>
						</b-col>
            <toggle-button v-show="isCtMri" @click.native="theReport.IsPositive = !theReport.IsPositive" :value="theReport.IsPositive" class="positive-btn" color="#dc3545" :font-size="16" :height="26" :width="72"
               :labels="{checked: '陽性', unchecked: '陰性'}"/>
         
						<b-col sm='2' class='px-1'><b-input-group prepend='檢查日期'><b-input tag="ScheduleTime" v-model='theProcedure.StudyDate' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group prepend='儀器類別'><b-input tag="Modality" v-model='theProcedure.Modality' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group prepend='檢查單號'><b-input tag="AccessionNo" v-model='theProcedure.AccessionNo' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group prepend='病歷編號'><b-input tag="PatientId" v-model='theProcedure.PatientId' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group prepend='病患來源'><b-input tag="PatientSourceTypeCode" v-model='theProcedure.PatientSourceType' readonly/></b-input-group></b-col>
					</b-row>
					<b-row no-gutters class='mt-1'>
						<b-col sm='4' class='px-1'><b-input-group  prepend='病患姓名'><b-input v-model='theProcedure.PatientName' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group  prepend='病患性別'><b-input v-model='theProcedure.PatientSex' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group  prepend='出生日期'><b-input v-model='theProcedure.PatientBirthday' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group  prepend='病患年齡'><b-input v-model='theProcedure.PatientAge' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'><b-input-group  prepend='病床編號'><b-input v-model='theProcedure.BedNo' readonly/></b-input-group></b-col>
					</b-row>
					<b-row no-gutters class='mt-1'>
              
						<b-col sm='4' class='px-1'><b-input-group tag="RequestingPhysicianName" prepend='開單醫師'><b-input v-model='theProcedure.RequestingPhysicianName' readonly/></b-input-group></b-col>
						<b-col sm='2' class='px-1'>
							<b-input-group>
								<b-input-group-prepend>
									<b-button variant="primary" @click='WinIQControlEdit'>影像品質</b-button>
								</b-input-group-prepend>
								<b-input v-model='NameOfImageQuality' readonly/>
							</b-input-group>
						</b-col>
						<b-col sm='4' class='px-1'>
							<b-input-group prepend='審核醫師'>
								<!-- /Employee/SelectNoList -->
								 <b-form-select :disabled="theReport.DxrStatus == 71 || canApproveReport" placeholder=""  :style="getDropDownStyle()" v-model="theReport.IssuePhysicianId" :options="approvalList"></b-form-select>
							</b-input-group>
						</b-col>
            <b-col sm='2' class='px-1'>
							<b-input-group prepend='報告狀態'>
									<b-input v-model='statusName' readonly/>
							</b-input-group>
						</b-col>
					</b-row>

					<b-row no-gutters class='mt-1' v-show="showDetails">
						<b-col sm='2' class='px-1'>
							<b-card no-body>
								<b-card-header class="bg-success text-white font-weight-bold cardHeader">
									<b-row no-gutters>
										<b-col cols="6" class="float-left text-left" @click="showVersionAlert(1)">檢查項目 {{  !labProcedures ?  "(暫無記錄)" : ""}}</b-col>
									</b-row>
								</b-card-header>
								<b-card-text class='p-0'>
									<b-container fluid class='p-0'>
										<b-row no-gutters>
											<b-textarea no-resize tag="ProcedureName" rows='4' class='border-0 rounded-0' v-model='labProcedures' readonly></b-textarea>
										</b-row>
									</b-container>
								</b-card-text>
							</b-card>
						</b-col>
						<b-col sm='4' class='px-1'>
							<b-card no-body>
								<b-card-header class="bg-danger text-white font-weight-bold cardHeader">
									<b-row no-gutters>
										<b-col cols="6" class="float-left text-left">客訴 {{  !theProcedure.Objective ?  "(暫無記錄)" : ""}}</b-col>
									</b-row>
								</b-card-header>
								<b-card-text class='p-0'>
									<b-container fluid class='p-0'>
										<b-row no-gutters>
											<b-textarea tag="Objective" no-resize rows='4' class='border-0 rounded-0' v-model='theProcedure.Objective' readonly></b-textarea>
										</b-row>
									</b-container>
								</b-card-text>
							</b-card>
						</b-col>
						<b-col sm='3' class='px-1'>
							<b-card no-body>
								<b-card-header class="bg-info text-white font-weight-bold cardHeader">
									<b-row no-gutters>
										<b-col cols="6" class="float-left text-left">主訴 {{  !theProcedure.Subjective ?  "(暫無記錄)" : ""}}</b-col>
									</b-row>
								</b-card-header>
								<b-card-text class='p-0'>
									<b-container fluid class='p-0'>
										<b-row ref='blkSubjective' no-gutters>
											<b-textarea tag="Subjective " no-resize rows='4' class='border-0 rounded-0' v-model='theProcedure.Subjective' readonly></b-textarea>
										</b-row>
									</b-container>
								</b-card-text>
							</b-card>
						</b-col>
						<b-col sm='3' class='px-1'>
							<b-card no-body>
								<b-card-header class="bg-warning font-weight-bold cardHeader">
									<b-row no-gutters>
										<b-col cols="6" @click="showPacsUrl" class="float-left text-left">檢查註記 {{  !theProcedure.RadiographerNote ?  "(暫無記錄)" : ""}} </b-col>
									</b-row>
								</b-card-header>
								<b-card-text class='p-0'>
									<b-container fluid class='p-0'>
										<b-row no-gutters>
											<b-textarea no-resize rows='4' tag="RadiographerNote" class='border-0 rounded-0' v-model='theProcedure.RadiographerNote' readonly></b-textarea>
										</b-row>
									</b-container>
								</b-card-text>
							</b-card>
						</b-col>
					
					</b-row>

					<b-row no-gutters class='mt-1 main-toolbar'>
						<b-col sm='2' class='px-1'>
              <b-input-group>
                <div class="form-control dtc-version-num">
                  <div @click="viewPrevRecord" :style="numObj"  style="text-align:right;"><font-awesome-icon :class="{'text-white':!isWhite, 'text-black': isWhite}" icon="arrow-left" /></div>
                  <div>{{dxrVersion}}</div>
                  <div  :style="numObj2" @click="viewNextRecord" ><font-awesome-icon :class="{'text-white':!isWhite, 'text-black': isWhite}"  icon="arrow-right" /></div>
                </div>
              </b-input-group>
            </b-col>
						<b-col sm='2' class='px-1'>
							<b-input-group prepend='連續報告' id="non-stop">
								<template v-slot='append'>
									<b-radio-group readonly name="ContinuousReport" v-model='continuousReportCode' :options='OptionsContinuousReport' buttons button-variant='outline-warning'>
									</b-radio-group>
								</template>
							</b-input-group>
						</b-col>
						
							<div class="dtc-toolbar">
								<b-button variant="primary"   class='mr-1' @click="callPacs"><font-awesome-icon icon="images" class='mr-1' />呼叫PACS</b-button>
                <b-button variant="info"      v-if="theReport.DxrStatus == 71"  v-show="isAbleToModifyReport()" class='mr-1' @click='addNoteB4Save()'><font-awesome-icon icon="save" class='mr-1' />修改報告</b-button>
                <b-button variant="info"      v-if="theReport.DxrStatus != 71" class='mr-1' @click='DataSave(63)'><font-awesome-icon icon="save" class='mr-1' />暫存報告</b-button>
								<b-button variant="success"   class='mr-1'  @click='DataSave(71)' :disabled="theReport.DxrStatus == 71"><font-awesome-icon icon="check" class='mr-1' />正式報告</b-button>
                <b-button variant="primary"   class='mr-1' @click='DataSave(65)' :disabled="theReport.DxrStatus == 71 || theReport.DxrStatus == 65 || theSamePerson"><font-awesome-icon icon="chalkboard-teacher" class='mr-1' />送交審核</b-button>
                <b-button variant="danger"    class='mr-1' @click='DataSave(61)' :disabled="!(theSamePerson && theReport.DxrStatus == 65)"><font-awesome-icon icon="chalkboard-teacher" class='mr-1' />退回重寫</b-button>
								<b-button variant="success"   class='mr-1' @click='WinMass4Phrase'><font-awesome-icon icon="book-medical" class='mr-1' />片語維護</b-button>
                <b-button variant="danger"    class='mr-1' @click="viewUrgentReport"><font-awesome-icon icon="sms" class='mr-1' />緊急通報</b-button>
                <b-button variant="info"    class='mr-1' @click="callView"><font-awesome-icon icon="sms" class='mr-1' />CALL LAB</b-button>
								<!--複雜呈現之按鈕-->
								<b-button 
									:variant="ShiftNoteNotice() ? 'warning' : 'dark'"
									:disabled="!ShiftNoteNotice()"
									class='mr-1'
									@click='WinMass4ShiftNote'
									><b-spinner small type="grow" class='mr-1 align-middle' v-if='ShiftNoteNotice()'/><font-awesome-icon icon="bell" class='mr-1' v-else /><span :class="{ 'blink': ShiftNoteNotice() }">交班記錄</span></b-button>
								<!-- <b-dropdown  id="dropdown-reportlist" text="癌症報告" dropleft  v-show="isCtMri">
									<b-dropdown-item v-for="(item,i) in reportList" :key="i" @click="editHtmlReport(item)">{{item.CSTName}}</b-dropdown-item>
								</b-dropdown> -->
								
								<b-button variant="info"  :disabled="!isCtMri || cstTab.length === 6" @click="reportTemplateOpen" class='mr-1'><font-awesome-icon icon="edit" class='mr-1'  />癌症報告</b-button>
								<b-button variant="success"  :disabled="!reportHistory.length" @click="versionHistoryOpen" class='mr-1'><font-awesome-icon icon='history' class='mr-1' />報告版次</b-button>
								
							</div>
							<div class="left-arrow dtc-arrow" @click="clickLeftArrow"  v-show="!leftMost" style="text-align:right;"><font-awesome-icon :class="{'text-white':!isWhite, 'text-black': isWhite}" icon="arrow-left" /></div>
							<div class="right-arrow dtc-arrow" @click="clickRightArrow" v-show="!rightMost" ><font-awesome-icon :class="{'text-white':!isWhite, 'text-black': isWhite}"  icon="arrow-right" /></div>
							<b-button variant="primary"  class='dtc-back' @click='backToPreviousRoute'><font-awesome-icon icon="arrow-circle-left" class="mx-1"  />返回</b-button>
					</b-row>

					<b-row no-gutters class='mt-1'>
						<b-col sm='2' class='px-1'>
							<b-card no-body>
								<b-card-header class="bg-primary font-weight-bold cardHeader">
									<b-row no-gutters>
										<b-col cols="6" class="float-left text-left text-white" @click="showVersionAlert(2)">歷史診斷報告
                      {{ this.historyList.length > 0  && !this.loadingHistory ? `(共${this.historyList.length}筆 )` : "(暫無記錄)"  }}
                    </b-col>
									</b-row> 
								</b-card-header>
                <b-card-text v-if="this.loadingHistory" class="text-white" style="flex-direction:column;padding: 1rem; text-algin:center; display:flex;">
                     <div>歷史診斷報告載入中, 請稍待 ..</div>
                     <b-spinner type="grow" label="Spinning" class="pl-3"></b-spinner>
                </b-card-text> 
          
								<b-card-text class='p-0'>
									<b-container fluid class='p-0'>
										<b-row no-gutters>
											<div ref='blkHistoryList' class='sb4RHis' style="position:relative;">
                        <div class="dtc-his-grid" style="background:#343a40">
                          <div v-if="historyList.length" style="padding-left:18px" class="title" :class="{'text-white':!isWhite, 'text-black': isWhite}">項目</div>
                          <div v-if="historyList.length" class="title" :class="{'text-white':!isWhite, 'text-black': isWhite}">完成時間</div>
                        </div>
                        <div class="dtc-his-grid" style="padding-top:5px;" v-for="(item, i) in historyList" :id="'dtc-history' + i" :key="'dtc-history' + i" @click="viewHistoryReport(item,i)" :class="i === 0 ? 'active-history' : ''">
                          <div class="title pl-1"  :title="item.ProcedureName" :class="{'text-white':!isWhite, 'text-black': isWhite}">{{ item.ProcedureName ? item.ProcedureName : item.ReportContent }} {{ item.ReportSource == 'DTC' && !item.ProcedureName ? '暫無記錄' : ''}}</div>
                          <div class="title" :title="item.ProcedureName" :class="{'text-white':!isWhite, 'text-black': isWhite}"
                           v-text="item.IssueTime ? DateToString(new Date(item.IssueTime)) : '暫無資料'"></div>
                        </div>
                        <!-- <b-link style="display:block;" class="my-1 ml-2 text-white" :class="{'text-white':!isWhite, 'text-black': isWhite}" v-for="(item, i) in historyList" :key="i">{{item}} </b-link> -->
											</div>
										</b-row>
									</b-container>
								</b-card-text>
							</b-card>
						</b-col>
						<b-col id='blkReportInput' ref='blkReportInput' sm='10' class='px-1'>
							<b-textarea id='DxRMain' no-resize class='border-primary sb4RHis' v-show="!showImgReport" debounce="500"
								ref="reportPlainText" v-model="theReport.ReportContent" @keyup.119="findReportPhraseStr" 
								placeholder='請於此處輸入報告內容' style="height:100%;padding-right:50px;font-family: Monaco !important;" wrap="hard" 
							/>
						
							<div class="sticky" v-if="reportImg">
								<b-button-group v-show="!fullScreen">
                 <b-button v-show="showCstBtns" v-if="theReport.DxrStatus != 71" variant="info"  size="sm"  class='mr-1' @click='DataSave(63)'><font-awesome-icon icon="save" class='mr-1' />暫存報告</b-button>
									<b-button v-show="showCstBtns" class="mr-1" size="sm" variant="success"  @click="editHtmlReport('')"><font-awesome-icon icon="edit" class='mr-1' />編輯癌症報告</b-button>
                  <b-button v-show="showCstBtns" size="sm" variant="danger" @click="showImgReport=true"><font-awesome-icon icon="chalkboard-teacher" class='mr-1' />切到癌症報告</b-button>
                  <div v-show="showCstBtns" class="ml-1"></div>
									<b-button v-show="showCstBtns" size="sm" variant="info" @click="exitFullScreen"><font-awesome-icon icon="pen"/>切到書寫報告</b-button>
                  <toggle-button ref="toggleView" class="ml-2 mt-1" @change="showCstBtns = !showCstBtns" :value="showCstBtns"  color="#dc3545" :height="24" :width="24"
               />
								</b-button-group> 
							</div>
              <div class="sb4RHis report-tab dtc-vue-tab title_center" v-show="showImgReport">
                 <vue-tabs active-tab-color="#e74c3c" active-text-color="white" >
                   <v-tab v-for="(item,i) in cstTab" class="title_center" :key="item.CSTName"  :title="item.CSTName" style="padding:10px;position:relative;color:white" @click="cstTabName = item.CSTName">
                     <div @click="cstTabName = item.CSTName" slot="title">{{item.CSTName}} <span @click.stop="_removeCstTab(i)" class="tab-close">&times;</span></div>
                       <img class="img-border" :src="item.img" >
                   </v-tab>
                    
                 </vue-tabs>
              </div>
						</b-col>
					</b-row>

				</b-container>
			</b-card-text>
		</b-card>

		<b-modal id='WinDiff0301' ref='Window4Diff'
			centered hide-footer size="xl" no-fade
			header-bg-variant='warning'
			header-text-variant='dark'
			body-class='py-1'
			>
			<template slot="modal-title"><font-awesome-icon icon="code-branch" class="mr-1"/><span class='zhTW'>版本差異</span></template>
			<div class="d-block zhTW">
				<b-row>
					<b-col>
						<!--
						<TxtDif :old-string="oldStr" :new-string="newStr" :context="10" outputFormat='side-by-side'/>
						-->
						<TxtDif :old-string="oldStr" :new-string="newStr" :context="10"/>
					</b-col>
				</b-row>
			</div>
		</b-modal>

		<b-modal id='WinMass0301' ref='Window4Mass'
			centered hide-footer scrollable size="xl" no-fade
			:header-bg-variant='winMassHeadBgV'
			:header-text-variant='winMassHeadTxV'
			body-class='py-1 themeModal'
			:body-bg-variant='winMassBodyBgV'
			>
			<template slot="modal-title"><font-awesome-icon :icon="(winMassComponent ? 'book-medical' : 'procedures')" class="mr-1"/><span class='zhTW'>{{winMassTitle}}</span></template>
			<div class="d-block zhTW">
				<b-row>
					<b-col class='px-1'>
						<RxP v-if="winMassComponent" :instantContent='instantContent'/>
						<b-textarea v-else no-resize rows="32" readonly v-model="winMassContent"/>
					</b-col>
				</b-row>
			</div>
		</b-modal>

		<b-modal id='WinHotkeyDetect0301' ref='WinHotkeyDetect'
			centered hide-footer no-fade
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4HotkeyDetect.HeadBgV'
			:header-text-variant='winConfig4HotkeyDetect.HeadTxV'
			:body-bg-variant='winConfig4HotkeyDetect.BodyBgV'
			:body-text-variant='winConfig4HotkeyDetect.BodyTxV'
			@ok='ModalOk'
			@cancel='ModalCancel'
			@close='ModalClose'
			@hide='ModalHide'
			>
			<template slot="modal-title"><font-awesome-icon icon="cog" class="mr-1"/><span class='zhTW'>{{winConfig4HotkeyDetect.Title}}</span></template>
			<div class="d-block zhTW">
				<b-container>
					<b-row class="mb-4">
						<b-col>
							<div><span :class="$IsThemeBlack() ? 'text-white' : 'text-danger' ">注意: 請勿按下<span class='align-text-bottom mx-1'><kbd>Alt</kbd> + <kbd>F4</kbd></span>, <span>那會關閉瀏覽器 !</span></span></div>
						</b-col>
					</b-row>
					<b-row class="mb-4">
						<b-col>
							<div><span v-html="HotkeyPressRemark"></span></div>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<div><span v-html="HotkeyPressMessage"></span></div>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<div class="float-right">
								<b-button variant="warning" class='mr-1' @click="EndOfKPInterceptor" :disabled='!(HotkeyPressed && HotkeyPressed.length > 0)'><font-awesome-icon icon="check" class='mr-1' />儲存設定</b-button>
							</div>
						</b-col>
					</b-row>
				</b-container>
			</div>
		</b-modal>

		<b-modal id='WinIQControl0301' ref='WinIQControl'
			centered hide-footer no-fade size="xl"
			body-class='py-1 themeModal'
			:header-bg-variant='winIQControl.HeadBgV'
			:header-text-variant='winIQControl.HeadTxV'
			:body-bg-variant='winIQControl.BodyBgV'
			:body-text-variant='winIQControl.BodyTxV'
			>
			<template slot="modal-title"><font-awesome-icon icon="image" class="mr-1"/><span class='zhTW'>{{winIQControl.Title}}</span></template>
			<div class="d-block zhTW">
				<b-container>
					<b-row>
						<b-col class='px-0'>
							<b-row class='mt-1'>
								<b-col>
									<b-input-group>
										<template v-slot:prepend>
											<b-input-group-text :class='{ "bg-light" : $IsThemeBlack(), "text-dark" : $IsThemeBlack()}'>影像品質</b-input-group-text>
										</template>
										<template v-slot='append'>
											<b-radio-group readonly name="ImageQualitySelect" v-model='DxReportIQCode' :options='optionsImageQuality' buttons button-variant='outline-primary'/>
										</template>
									</b-input-group>
								</b-col>
							</b-row>
							<b-row class='mt-1 mb-1'>
								<b-col>
									<b-textarea id='IQCNote' ref="IQControlNote"
										no-resize rows="15" class='border-primary'
										v-model="DxReportIQNote"
										placeholder='請於此處輸入影像品質註記'
									/>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</b-container>
			</div>
		</b-modal>

		<b-modal id='WinConfig0301' ref='WinConfig'
			centered hide-footer no-fade size="xl"
			body-class='py-1 themeModal'
			:header-bg-variant='winConfigure.HeadBgV'
			:header-text-variant='winConfigure.HeadTxV'
			:body-bg-variant='winConfigure.BodyBgV'
			:body-text-variant='winConfigure.BodyTxV'
			>
			<template slot="modal-title"><font-awesome-icon icon="cog" class="mr-1"/><span class='zhTW'>{{winConfigure.Title}}</span></template>
			<div class="d-block zhTW">
				<b-row>
					<b-col class='px-0'>
						<b-container fluid class='px-1'>
							<b-row><b-col><hr></b-col></b-row>
							<b-row>
								<b-col>
									<b-container>
										<b-row v-for='(i, index) in Math.ceil(HotkeyTempSet.length / 3)' :key='index' class='my-1'>
											<b-col sm='4' v-for='(item, idx) in HotkeyTempSet.slice((i - 1) * 3, i * 3)' :key='idx'>
												<b-button :variant='$IsThemeBlack() ? "primary" : "success"' @click='Item4Config(item.title)' class='mr-1'>{{ item.title }}</b-button>
												<span v-html='KeyCode2Text(item.hotkey)' class='mx-1'></span>
											</b-col>
										</b-row>
									</b-container>
								</b-col>
							</b-row>
							<b-row><b-col><hr></b-col></b-row>
							<b-row class='my-2'>
								<b-col>
									<div class="float-right">
										<b-button variant="info" hidden class='mr-2' @click="HotkeyConfigReset"><font-awesome-icon icon="undo" class='mr-1' />回復設定</b-button>
										<b-button variant="danger" class='mr-2' @click="HotkeyConfigDefault"><font-awesome-icon icon="eraser" class='mr-1' />重置成系統初始設定</b-button>
										<b-button variant="warning" hidden class='mr-2' @click='HotkeyConfigSave'><font-awesome-icon icon="save" class='mr-1' />儲存設定</b-button>
									</div>
								</b-col>
							</b-row>
						</b-container>
					</b-col>
				</b-row>
			</div>
		</b-modal>

		<b-modal id='WinHelp0301' ref='WinHelp'
			centered hide-footer no-fade size="xl"
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4HotkeyDetect.HeadBgV'
			:header-text-variant='winConfig4HotkeyDetect.HeadTxV'
			:body-bg-variant='winConfig4HotkeyDetect.BodyBgV'
			:body-text-variant='winConfig4HotkeyDetect.BodyTxV'
			>
			<template slot="modal-title"><font-awesome-icon icon="question" class="mr-1"/><span class='zhTW'>{{winConfig4HotkeyDetect.Title}}</span></template>
			<div class="d-block zhTW">
				<b-row>
					<b-col class='px-0'>
						<b-container fluid class='px-1'>
							<b-row><b-col><h4>Hotkey:</h4></b-col></b-row>
							<b-row><b-col><hr></b-col></b-row>
							<b-row>
								<b-col>
									<b-container>
										<b-row v-for='(i, index) in Math.ceil(HotkeyList.length / 3)' :key='index' class='my-1'>
											<b-col sm='4' v-for='(item, idx) in HotkeyList.slice((i - 1) * 3, i * 3)' :key='idx'>
												<span class='mr-1'>{{ item.title }}</span>
												<span v-html='KeyCode2Text(item.hotkey)' class='align-text-bottom mx-1'></span>
											</b-col>
										</b-row>
									</b-container>
								</b-col>
							</b-row>
							<b-row><b-col><hr></b-col></b-row>
						</b-container>
					</b-col>
				</b-row>
			</div>
		</b-modal>

		<b-modal id="report-template" ref="reportTemplate"
			centered hide-footer no-fade size="sm" scrollable
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4ReportTemple.HeadBgV'
			:header-text-variant='winConfig4ReportTemple.HeadTxV'
			:body-bg-variant='winConfig4ReportTemple.BodyBgV'
			:body-text-variant='winConfig4ReportTemple.BodyTxV'>
			<template slot="modal-title"><font-awesome-icon icon="edit" class="mr-1"/><span class='zhTW'>癌症報告</span></template>
			<div>
				<b-link style="display:block;" class="my-1" :class="{'text-white':!isWhite}" v-for="(item,i) in reportList" :key="i" @click="editHtmlReport(item)">{{item.CSTName}}</b-link>
			</div>

		</b-modal>

		<b-modal id="version-history" ref="versionHistory"
			centered hide-footer no-fade size="sm" scrollable
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4VersionHistory.HeadBgV'
			:header-text-variant='winConfig4VersionHistory.HeadTxV'
			:body-bg-variant='winConfig4VersionHistory.BodyBgV'
			:body-text-variant='winConfig4VersionHistory.BodyTxV'>
			<template slot="modal-title"><font-awesome-icon icon="code-branch" class="mr-1"/><span class='zhTW'>{{`報告版次(共` +reportHistory.length + `筆 )`}}</span></template>
			<div>
				<b-link style="display:block;" class="my-1 text-white" :class="{'text-white':!isWhite}" v-for='(item, index) in reportHistory' v-bind:key='index' 
				@click="DoThis(innerProprty4DynamicDeclare.name4ContentDiff, item)">{{item}}</b-link>
			</div>
		</b-modal>

    <b-modal id="add-note-b4-save" ref="addNoteB4Save"
			centered hide-footer no-fade size="lg" scrollable
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4VersionHistory.HeadBgV'
			:header-text-variant='winConfig4VersionHistory.HeadTxV'
			:body-bg-variant='winConfig4VersionHistory.BodyBgV'
			:body-text-variant='winConfig4VersionHistory.BodyTxV'>
			<template slot="modal-title"><font-awesome-icon icon="code-branch" class="mr-1"/><span class='zhTW'>修改報告</span></template>
			<div style="margin-top:1rem;">
        <h6>修改報告原因:</h6>
        <div v-for="item in modifyOptions" :key="item.id"  class="urgent-opt" v-show="urgentPriorityCode == 'u2'">
          <input type="radio" :id="item.id" v-model="modifyOpt" :value="item.value">
          <label :for="item.id">{{item.text}}</label>
        </div>
			</div>
      
      <div class="footer-b4-save">
            <div></div>
            <b-form-checkbox style="margin-top:20px;"
              v-model="smsMsg"
              name="checkbox-1"
            >修改報告,通知開單醫師
             </b-form-checkbox>
          
          <b-button  variant="primary" @click="clickSaveSMS">修改報告</b-button>
          <b-button @click="$bvModal.hide('add-note-b4-save')">取消</b-button>
      </div>

		</b-modal>

    <b-modal id="urgent-report" ref="urgentReport"
			centered hide-footer no-fade size="lg" scrollable
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4VersionHistory.HeadBgV'
			:header-text-variant='winConfig4VersionHistory.HeadTxV'
			:body-bg-variant='winConfig4VersionHistory.BodyBgV'
			:body-text-variant='winConfig4VersionHistory.BodyTxV'>
			<template slot="modal-title"><font-awesome-icon icon="code-branch" class="mr-1"/><span class='zhTW'>緊急通報</span></template>
			<div style="margin-top:12px">
        <div style="margin-bottom:12px;">緊急傳呼發給開單醫師的簡訊如下:</div> 
			 	<b-input-group prepend='通報等級' @click="urgentOpt=1;otherInput=''">
								<template v-slot='append'>
									<b-radio-group  v-model='urgentPriorityCode' :options='urgentLevels' buttons button-variant='outline-danger'>
									</b-radio-group>
								</template>
				</b-input-group>
        <div v-for="(item, i) in urgOptions" :key="item.id"  class="urgent-opt" v-show="urgentPriorityCode == 'u2'">
          <input type="radio" :id="item.id" v-model="urgentOpt" :value="item.value">
          <label :for="item.id">{{item.text}}</label>
          <input class="input" v-if=" i + 1 === urgOptions.length" v-model="otherInput">
        </div>
        <div v-for="(item, i) in urg2Options" :key="item.id"  class="urgent-opt" v-show="urgentPriorityCode == 'u1'">
          <input type="radio" :id="item.id" v-model="urgentOpt" :value="item.value">
          <label :for="item.id">{{item.text}}</label>
          <input class="input" v-if=" i + 1 === urg2Options.length" v-model="otherInput">
        </div>
        <textarea class="sms-input"  :value="urgentPlaceholder"></textarea>
        <div class="urgent-btns">
          <b-btn variant="secondary" style="visibility: hidden;" class="px-5" size="lg">報告內容</b-btn>
          <div></div> 
          <b-btn variant="primary" class="px-5" size="lg" @click="notifyUrgentMsg">確定</b-btn>
          <b-btn variant="secondary" @click="$bvModal.hide('urgent-report')" size="lg" class="px-5">取消</b-btn>
        </div>
        
			</div>
		</b-modal>

    <b-modal id="view-history" ref="viewHistory"
			centered hide-footer no-fade size="lg" scrollable
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4VersionHistory.HeadBgV'
			:header-text-variant='winConfig4VersionHistory.HeadTxV'
			:body-bg-variant='winConfig4VersionHistory.BodyBgV'
			:body-text-variant='winConfig4VersionHistory.BodyTxV'>
			<template slot="modal-title"><font-awesome-icon icon="report" class="mr-1"/><span class='zhTW'>歷史診斷報告</span></template>
			<div class="view-history-pop">
        <div class="wired-content" v-show="viewHistoryItem.ReportSource === 'EBM'">
          <b-button @click="copyPasteText(viewHistoryItem.ReportContent)" variant="info"><font-awesome-icon icon="copy" class="mr-1" />複製診斷報告內文</b-button>
          <div v-if="copyOk"  style="color:red;">資料已複製並貼上</div>
         <b-textarea v-model="viewHistoryItem.ReportContent" style="flex:1"></b-textarea>
        </div>
        <div class="left" v-show="viewHistoryItem.ReportSource === 'DTC'">
           <div class="block">
                <div>  檢查項目  :</div> 
                <div> {{ viewHistoryItem.ProcedureName  ? viewHistoryItem.ProcedureName  : "暫無資料" }}</div>  
            </div>
            <div class="block">
                <div>  檢查完成時間  :</div> 
                <div v-text="DateToString(new Date(viewHistoryItem.IssueTime) , true)"> </div>  
            </div>
            <div class="block">
                <div>申請單號: </div> 
                <div> {{ viewHistoryItem.OrderNo }}</div>  
            </div>
            <div class="block">
              <div>檢查單號:</div> 
                <div> {{ viewHistoryItem.AccessionNo }}</div>  
            </div>
            <div class="block">
               <div>報告狀態:</div> 
                <div v-text="getStatus(viewHistoryItem.DxrStatus)"></div>    
            </div>
            <div class="block">
               <div>報告版次:</div> 
                <div> {{ viewHistoryItem.DxrVersion }}</div>    
            </div>
            <div class="block">
                <div>撰寫人員代碼:</div> 
                <div> {{ viewHistoryItem.DxreportPhysicianId }}</div>  
            </div>
            <div class="block">
                <div>審核人員代碼:</div> 
                <div> {{ viewHistoryItem.ApprovalPhysicianId ? viewHistoryItem.ApprovalPhysicianId  : "暫無資料"}}</div>  
            </div>
            <div class="block">
                <div>正式報告醫師代碼:</div> 
                <div> {{ viewHistoryItem.IssuePhysicianId ? viewHistoryItem.IssuePhysicianId  : "暫無資料"}}</div>  
            </div>
            
            <div class="block">
                <div>正式報告審核成立之日期時間:</div> 
                <div v-text="DateToString(new Date(viewHistoryItem.IssueTime) , true)"></div>  
            </div>
            <div class="block">
                <div>正式報告醫師之證照編號:</div> 
                <div> {{ viewHistoryItem.IssuePhysicianMdlNo ? viewHistoryItem.IssuePhysicianMdlNo : "暫無資料" }}</div>  
            </div>
            <div class="block" hidden>
                <div>Image</div> 
                <div> {{ viewHistoryItem.StructureImage ? viewHistoryItem.StructureImage : "暫無資料" }}</div>  
            </div>
            <div class="block">
                <div>病歷編號:</div> 
                <div> {{ viewHistoryItem.PatientId ? viewHistoryItem.PatientId : "暫無資料" }}</div>  
            </div>
             <div class="block">
                <div> 報告撰寫人員:</div> 
                <div> {{ viewHistoryItem.DxreportPhysicianName ? viewHistoryItem.DxreportPhysicianName : "暫無資料" }}</div>  
            </div>
             <div class="block">
                <div> 審核人員 :</div> 
                <div> {{ viewHistoryItem.ApprovalPhysicianName  ? viewHistoryItem.ApprovalPhysicianName  : "暫無資料" }}</div>  
            </div>
             <div class="block">
                <div> 正式報告醫師  :</div> 
                <div> {{ viewHistoryItem.IssuePhysicianName  ? viewHistoryItem.IssuePhysicianName  : "暫無資料" }}</div>  
            </div>
           
        </div>
        <div class="right" v-show="viewHistoryItem.ReportSource === 'DTC'">
          <div v-if="viewHistoryItem.CSTName1"> 
             <vue-tabs active-tab-color="#e74c3c" active-text-color="white">
                   <v-tab v-for="(item) in 6" :key="item" class="title_center"  style="padding:10px;position:relative;color:white" v-if="viewHistoryItem[`CSTName${item}`]">
                     <div slot="title">{{viewHistoryItem[`CSTName${item}`]}}</div>
                       <img class="img-border" :src="viewHistoryItem[`StructureImage${item}`]" >
                   </v-tab>
                    
            </vue-tabs>
          </div> 
          <div class="mb-2" style="margin-top:1rem;"> 診斷報告內文 <b-button v-if="viewHistoryItem.ReportContent"  @click="copyPasteText(viewHistoryItem.ReportContent)" variant="info"><font-awesome-icon icon="copy" class="mr-1" />複製診斷報告內文</b-button></div> 
          <div v-if="copyOk"  style="color:red;">資料已複製並貼上</div>
          <div v-if="!viewHistoryItem.ReportContent" class="mb-5" > 暫無記錄</div>
          <b-textarea v-if="viewHistoryItem.ReportContent" v-model="viewHistoryItem.ReportContent" class="mb-5" style="width:50vw; min-height:calc(100vh-250px);"></b-textarea>
        </div>
			</div>
			

		</b-modal>

		<b-modal id='WinCST0301' ref='WinCST'
			centered hide-footer no-fade size="xl" scrollable
			body-class='py-1 themeModal'
			:header-bg-variant='winConfig4StructureReport.HeadBgV'
			:header-text-variant='winConfig4StructureReport.HeadTxV'
			:body-bg-variant='winConfig4StructureReport.BodyBgV'
			:body-text-variant='winConfig4StructureReport.BodyTxV'
			
			@hide='WinCSTHide'
			>
			<template slot="modal-title">
				<section class="title-grid">
					<div>
						<font-awesome-icon icon="edit" class="mr-1"  />
						<span class='zhTW'>{{winConfig4StructureReport.Title}}</span>
					</div>
					<div>
						<b-btn :disabled="theReport.DxrStatus == 71" variant="primary" size="md" class="mx-3" @click="saveFullScreenForm"><font-awesome-icon icon="save" class='mr-1' /> 報告存檔 </b-btn> 
						<b-btn size="md" @click="resetFullScreenForm"><font-awesome-icon icon="undo" class='mr-1' /> 重置報告</b-btn> 
					</div>
				</section>
			</template>
			<div class="d-block zhTW">
				<b-form id='WinCST0301DxRSC'>
					<b-row ref="myReportImg">
						<b-col class='px-2' id="my-report-img" v-html="cstReportHtml"></b-col>
					</b-row>
				</b-form>
			</div>
		</b-modal>

	</div>
</template>

<script>
import Swal from "sweetalert2";
import * as configs from '@/config'
//import * as SmartTextarea from "smart-textarea/dist/bundle.js"

import {
  DataManager,
  WebApiAdaptor,
} from "@syncfusion/ej2-data";

import {dateFormatMixin} from '@/SupportLib_J.js'

// 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Control = configs.KeyCode4Control
const KeyCode4Alternate = configs.KeyCode4Alternate
const KeyCode4Shift = configs.KeyCode4Shift

// 載入模組:KeyPressIdentifier   
import KeyPressIdentifier from '@/assets/KeyPressIdentifier'
// HotKey 預設組態
let defaultHotKeyArr = [
  // F1 to F10
	{ hotkey: 'F1', default: 'F1', method: 'HelpShow', title: '功能說明' },
  { hotkey: 'F2', default: 'F2', method: 'callPacs', title: '呼叫PAC' },
  { hotkey: 'F3', default: 'F3', method: 'WinMass4Objective', title: '醫師客訴' },
  { hotkey: 'F4', default: 'F4', method: 'WinMass4Subjective', title: '病患主訴' },
  { hotkey: 'F5', default: 'F5', method: 'viewUrgentReport', title: '緊急通報' },
  { hotkey: 'F6', default: 'F6', method: 'WinMass4Phrase', title: '片語維護' },
  { hotkey: 'F7', default: 'F7', method: 'WinMass4Radiographer', title: '檢查註記' },
	{ hotkey: 'F8', default: 'F8', method: 'InstantPhraseCreate', title: '快速片語' },
  { hotkey: 'F9', default: 'F9', method: 'WinIQControlEdit', title: '影像品質' },
  { hotkey: 'F10', default: 'F10', method: 'versionHistoryOpen', title: '報告版次' },
 
  // Alt + key
  { hotkey: KeyCode4Alternate + 'F1', default: KeyCode4Alternate + 'F1', method: 'WinMass4ShiftNote', title: '交班記錄' },
  { hotkey: KeyCode4Alternate + 'F2', default: KeyCode4Alternate + 'F2', method: 'reportTemplateOpen', title: '癌症報告' }, 
  { hotkey: KeyCode4Alternate + 'F3', default: KeyCode4Alternate + 'F3', method: 'backToPreviousRoute', title: '返回清單' }, 
  { hotkey: KeyCode4Alternate + 'F4', default: KeyCode4Alternate + 'F4', method: 'toggleDetailView', title: '顯示詳情' },
  { hotkey: KeyCode4Alternate + 'F5', default: KeyCode4Alternate  + 'F5', method: 'goNextHistory', title: '歷史診斷報告到下一筆' },
  { hotkey: KeyCode4Alternate + 'F6', default: KeyCode4Alternate  + 'F6', method: 'goPrevHistory', title: '歷史診斷報告到上一筆' },
  { hotkey: KeyCode4Alternate + 'F7', default: KeyCode4Alternate  + 'F7', method: 'openHistory', title: '開啟歷史診斷報告' },
  { hotkey: KeyCode4Alternate + 'F8', default: KeyCode4Alternate  + 'F8', method: 'addNoteB4Save', title: '修改正式報告' },
  
  //{ hotkey: KeyCode4Alternate + 'F8', default: KeyCode4Alternate  + 'F8', method: 'copyPasteText', title: '複製診斷' },

   //{ hotkey: 'KC.F1', default: 'KC.F1', method: 'FocusOnContent', title: '報告內容' },
  //key for saving and sending the report in database Ctrl + key
 
  { hotkey: KeyCode4Control + 'F2', default: KeyCode4Control + 'F2', method: 'DataSave',param:63, title: '暫存報告' },
  { hotkey: KeyCode4Control + 'F3', default: KeyCode4Control + 'F3', method: 'DataSave',param:65, title: '送交審核' },
  { hotkey: KeyCode4Control + 'F4', default: KeyCode4Control + 'F4', method: 'DataSave',param:71, title: '正式報告' },
  { hotkey: KeyCode4Control + 'F5', default: KeyCode4Control + 'F5', method: 'DataSave',param:61, title: '退回重寫' },
  // nav next record keys Crl+ key
  { hotkey: KeyCode4Control + 'F6', default: KeyCode4Control + 'F6', method: 'viewNextRecord', title: '到下一筆報告撰寫作業' },
  { hotkey: KeyCode4Control + 'F7', default: KeyCode4Control + 'F7', method: 'viewPrevRecord', title: '到上一筆報告撰寫作業' },
  
//this.viewNextRecord
]

// 動態宣告-外部
var OutterProprty4DynamicDeclare = {
	name4ContentDiff: 'versionDiffByDynamic',
}

//	1. 安裝: $ npm i vue-code-diff
//	2. 再加自行撰寫 TextDiff
//	- 這個 plug-in 不是很合用, 但先勉強湊和著用
import TxtDif from "@/components/TextDiff"

// 載入模組:片語維護
import RxP from "@/components/CI0302ReportPhrase"
import html2canvas from 'html2canvas'
import hotkeys from 'hotkeys-js'
export default {
	name: "FI0301",
  components: { TxtDif, RxP },
  mixins: [dateFormatMixin],
	data() {
		return {
      windowObj:'',
      callLab: 'https://onepage.wanfang.gov.tw/#@',
      showCstBtns: true,
      loadingHistory: false,
      origDxStatus: '',
      showAlert: false,
      copyOk: false,
      cstTab:[],
      cstTabName:'',
      title:'書寫報告書寫',
      smsMsg: "",
      whySaveText:'',
      isDataChange: false,
      showDetails: true,
      phraseRecords:[],
      statusName:'',
      otherInput : '',
      hideNextPrevBtn: false,
      nextViewArr : [],
      modifyOpt:1,
      modifyOptions: [ 
          { id: 'tesion', value: 1, text:'閱片太快' },
          { id: 'pne', value: 2, text:'行政疏忽' },
          { id: 'active', value: 3, text:'配合臨床' },
          { id: 'tb', value: 4, text:'獲得其他影像資訊' },
          { id: 'last', value: 5, text:'不良影像' },
          { id: 'others', value: 90, text:'其他' },],
      cstReportHtml:'',
      urgentPriorityCode:'u2',
      urgentOpt: '1',
      urgOptions: [
          { id: 'tesion', value: 1, text:'Tension Pneumothorax' },
          { id: 'pne', value: 2, text:'Pneumoperitoneum' },
          { id: 'active', value: 3, text:'Active bleeding in thorax and abdomen' },
          { id: 'tb', value: 4, text:'TB with cavitation' },
          { id: 'last', value: 5, text:'Aortic aneurysm(diameter >= 5CM) or Aortic dissection' },
          { id: 'others', value: 90, text:'Others' },
      ],
      urg2Options: [
          { id: 'tb2', value: 1, text:'R/O TB' },
          { id: 'tumor', value: 2, text:'Unsuspected tumor' },
          { id: 'pne2', value: 3, text:'Pneumothorax' },
          { id: 'active2', value: 4, text:'Aortic aneurysm (diameter >= 4~<5cm)' },
          { id: 'others2', value: 90, text:'Others' },
      ],
      dxrVersion: '',
      currentNum: 1,
      initArray:[],
      totalArrayLen:'',
      viewHistoryItem: '',
      imgQualityList:[],
      ApprovalPhysicianName:null,
      approvalList:[],
      historyList:[],
			options: [
				{ value: null, text: 'Please select an option' },
				{ value: 'a', text: 'This is First option' },
        	],
			leftMost: true,
			rightMost: false,
			myFullScreenItem :'',
			reportList: [],
			fullScreen: false,
			gray: '#868e96',
			showImgReport: false,
			reportImg: '',
			isWhite: true,
			isBlack: false,
			isGray: false,
			PublicPath: process.env.BASE_URL,
			BasePath: this.$route.path,
			ObjApp: null,
			VueNestLevel: 0,
			//
			UserId: 'Pollux',
			// 功能啟動時之先決條件的處理狀況
			prerequisiteCompleted: false,
			prerequisiteFailure: false,
			// 動態宣告-內部
			innerProprty4DynamicDeclare: OutterProprty4DynamicDeclare,
			// 是否容許 HotKey 攔截器作用?
			allowHotKeyFunctional: true,
			// 佈景主題
			themePacks: {
				themeBlack: false,
				//emeBlackName: 'themeBlack',
				themeBlackName: configs.ThemeId4Black,
			},
			// 內文差異比對
			oldStr: 'Older String',
			newStr: 'Newer String',
			// 大對話框呈現內文
			winMassTitle: '',
			winMassContent: '',
			winMassHeadBgV: '',
			winMassHeadTxV: '',
			winMassBodyBgV: '',
			winMassComponent: false,
			//
			winConfigure: {
				HeadBgV: '',
				HeadTxV: '',
				BodyBgV: '',
				BodyTxV: '',
				Title: `HotKey 組態設定 (共${defaultHotKeyArr.length}筆)`,
				Content: '',
			},
			winIQControl: {
				HeadBgV: '',
				HeadTxV: '',
				BodyBgV: '',
				BodyTxV: '',
				Title: '影像品質',
				Content: '',
			},
			winConfig4HotkeyDetect: {
				HeadBgV: '',
				HeadTxV: '',
				BodyBgV: '',
				BodyTxV: '',
				Title: 'Hotkey 設定',
				Content: '',
			},
			winConfig4StructureReport: {
				HeadBgV: '',
				HeadTxV: '',
				BodyBgV: '',
				BodyTxV: '',
				Title: '編輯癌症報告',
				Content: '',
			},
			winConfig4ReportTemple: {
				HeadBgV: '',
				HeadTxV: '',
				BodyBgV: '',
				BodyTxV: '',
				Title: '癌症報告',
				Content: '',
			},
			winConfig4VersionHistory: {
				HeadBgV: '',
				HeadTxV: '',
				BodyBgV: '',
				BodyTxV: '',
				Title: '歷史版本',
				Content: '',
			},
			HotkeyList: [],
			HotkeyTempSet: [],
			HotkeyCurrentItemName: '',
			HotkeyPressed: '',
			HotkeyPressRemark: '',
			HotkeyPressMessage: '',
			UnderHotkeyDetect: false,
			// 片語相關資料
			reportPhrase: {
				GUID: -1,
				PhraseCode: '',
				Replacement: '',
				OPPrgId: '',
			},
			theMacroList: [],
			// 檢查相關資料
			casePriorityCode: 'Y',
			continuousReportCode: 'Y',
			theProcedure: {
        StatusName: '',
				AccessionNo: '123A567BC',//檢查單號(大單號)
				StudyDate: '2019/10/14',//檢查日期
				Modality: 'CT/MRI',//檢查儀器
				PatientId: '1234567-8',//病歷編號
				PatientSourceType: 'O-門診',//病患來源
				PatientName: '趙大升',
        PatientSex: 'M-男性',
				PatientBirthday: '1943/12/31',
				PatientAge: 76,
				Subjective: '這裡放的是病患主訴',
				Objective: '這裡是醫師客訴',
				//RadiographerNote: '這是放射師的檢查註記',
				RadiographerNote: '這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n',
				RequestingPhysicianId: '1231',
				RequestingPhysicianName: '開單醫師',
				BedNo: '701221',//床號
				ShiftNote: '這是交班記錄',
			},
			labProcedures: '檢查項目一\n檢查項目二\n檢查項目三\n檢查項目四',
			// 報告相關資料
			theReport: null,
      origReportContent: '',
      origCstHtmlData:'',
			reportHistory: [],
			//
			optionsImageQuality: [],
			//
			instantContent: '',
		};
	},
	computed: {
    loginId() {
      return this.$store.state.Profile4User.id;
    },
    canApproveReport() {
      const v = this.approvalList.find( s => this.loginId === s.value);
      return v ? true : false;
    },
    theSamePerson () {
      const v = this.theReport.IssuePhysicianId === this.loginId;
      return v;
    },
    numObj () {
      return { visibility: this.currentNum <= 1 || this.hideNextPrevBtn ? 'hidden' : 'visible', cursor:'pointer'};
    },
    numObj2 () {
      return { visibility: this.currentNum >= this.totalArrayLen || this.hideNextPrevBtn ? 'hidden' : 'visible', cursor:'pointer'};
    },
    urgentPlaceholder () {
      let v = '';
      if(this.urgentPriorityCode == 'u2') {
        v = this.urgOptions.find( s => s.value == this.urgentOpt);
      }else {
        v = this.urg2Options.find( s => s.value == this.urgentOpt);
      }
      if(!v) return "";
      return `病患姓名: ${this.theProcedure.PatientName} 病歷編號: ${this.theProcedure.PatientId}  緊急危險(${v.text}), 請速閱放射報告,並聯絡病患. ${ this.urgentOpt == 90 ? this.otherInput : ''} `
    },
		isCtMri (){ 
			return this.theProcedure.Modality.includes('CT') || this.theProcedure.Modality.includes('MR');
		},
		MacroItemList() {
			// 片語簡易清單
			console.log(this.$logs())
			return this.theMacroList
    },
    urgentLevels () {
      return [
				{ text: '異常值通報', value: 'u1' },
				{ text: '緊急危險通報', value: 'u2' },
			]
    },
		OptionsCasePriority() {
      return this.casePriorityCode == 'Y' ? [{ text: '急件', value: 'Y' }] :	[{ text: '一般', value: 'N' }];
		},
		OptionsContinuousReport() {
			// 連續(登打)報告之啟用與否?
			return [
				{ text: '啟用', value: 'Y' },
				{ text: '取消', value: 'N' },
			]
		},
		NameOfImageQuality() {
      let value = ''
     // alert(this.theReport.ImageQualityCode);
			if(this.theReport && this.theReport.ImageQualityCode) {
        //alert(this.theReport.ImageQualityCode)
				if(this.optionsImageQuality && this.optionsImageQuality.length > 0) {
					this.optionsImageQuality.some(e => {
						if(e.value === this.theReport.ImageQualityCode) {
							value = e.text
							return true
						}
					})
				}
			}
			return value
    },
		DxReportVersion: {
			get() { return this.dxrVersion ? this.dxrVersion : "編輯中..." },
			set(v) { this.dxrVersion = v }
		},
		DxReportContent: {
			get() { return this.theReport && this.$Exists(this.theReport.ReportContent) ? this.theReport.ReportContent : "" },
			set(v) { if(this.theReport && this.$Exists(this.theReport.ReportContent)) this.theReport.ReportContent = v }
		},
		DxReportExtraNote: {
			get() { return this.theReport && this.$Exists(this.theReport.ExtraNote) ? this.theReport.ExtraNote : "" },
			set(v) { if(this.theReport && this.$Exists(this.theReport.ExtraNote)) this.theReport.ExtraNote = v }
		},
		DxReportIQCode: {
			get() { return this.theReport && this.$Exists(this.theReport.ImageQualityCode) ? this.theReport.ImageQualityCode : "" },
			set(v) { if(this.theReport && this.$Exists(this.theReport.ImageQualityCode)) this.theReport.ImageQualityCode = v }
		},
		DxReportIQNote: {
			get() { return this.theReport && this.$Exists(this.theReport.ImageQualityNote) ? this.theReport.ImageQualityNote : "" },
			set(v) { if(this.theReport && this.$Exists(this.theReport.ImageQualityNote)) this.theReport.ImageQualityNote = v }
		},
		// DxRStructureData: {
		// 	get() { return this.theReport && this.$Exists(this.theReport.StructureData) ? this.theReport.StructureData : "" },
		// 	set(v) { if(this.theReport && this.$Exists(this.theReport.StructureData)) this.theReport.StructureData = v }
    // },
    // DxRStructureeContent: {
		// 	get() { return this.theReport && this.$Exists(this.theReport.StructureContent) ? this.theReport.StructureContent : "" },
		// 	set(v) { if(this.theReport && this.$Exists(this.theReport.StructureContent)) this.theReport.StructureContent = v }
    // },
    // DxRStructureImage: {
		// 	get() { return this.theReport && this.$Exists(this.theReport.StructureImage) ? this.theReport.StructureImage : "" },
		// 	set(v) { if(this.theReport && this.$Exists(this.theReport.StructureImage)) this.theReport.StructureImage = v }
    // },
    
	},
	methods: {
    showVersionAlert(n) {
      if(!this.showAlert && n === 1) {
        this.showAlert = true;
        return;
      }else if(this.showAlert && n === 2) {
        alert('this.origDxStatus ' + this.origDxStatus + "\n" + 'this.theReport.DxrStatus:  ' + this.theReport.DxrStatus);
      }
    },
    _removeCstTab(i) {
      Swal.fire({
        title: '移除癌症報告:',
        text: `${this.cstTab[i].CSTName}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.value) {
          this.removeCstTab(i);
        }
      })

    },
    removeCstTab(i) {
      this.cstTab.splice(i,1);
      if(!this.cstTab.length) {
        this.reportImg = '';
        this.showImgReport = false;
        this.cstTabName = '';
      }else {
        this.cstTabName = this.cstTab[0].CSTName;
      }
      if(this.theReport.DxrStatus == 71) return;
      this.DataSave(this.theReport.DxrStatus, true);
    },
    ShiftNoteNotice() {
      return this.theProcedure.ShiftNote && this.theProcedure.ShiftNote.length > 0 && this.theProcedure.ShiftNote
		},
    async notifyUrgentMsg() {
      //urgentPriorityCode 緊急 'u2' and 'u1'
      //alert(this.urgentPriorityCode)
      //alert(this.urgentOpt)
      //alert(this.urgentPlaceholder)
      if(!this.urgentPlaceholder) {
        this.ObjApp.TimingMessage('尚未輸入緊急通報原因, 不得存檔.', 2);
        return;
      }
      let obj = {};
      obj.RequestingPhysicianId = this.loginId;
      obj.DxReportPhysicianId = this.theReport.DxreportPhysicianId ? this.theReport.DxreportPhysicianId : this.loginId;
      obj.AccessionNo = this.theProcedure.AccessionNo;
      obj.Message = this.urgentPlaceholder;
      obj.HRRLevelId = this.urgentPriorityCode == 'u2' ? 1 : 2;
      obj.HRRItemId = this.urgentOpt;
      let v = '';
      if(this.urgentPriorityCode == 'u2') {
        v = this.urgOptions.find( s => s.value == this.urgentOpt);
      }else {
        v = this.urg2Options.find( s => s.value == this.urgentOpt);
      }
      obj.HRRItemDesc = v.text;
      obj.HRROthersNote = this.otherInput;
      this.ObjApp.WaitingShow();
      try {
        await window.axios.post('/Hrr/Save', obj);
        this.ObjApp.TimingMessage('緊急通知成功送出')
      }catch(e) {
        this.ObjApp.TimingMessage('送出緊急通知失敗', 2);
      }finally {
        this.ObjApp.WaitingHide();
        this.$bvModal.hide('urgent-report');
      }
     

    },
    async callView() {
      const url = this.callLab + this.theProcedure.PatientId;
      let ok = true;
      this.openPopupWindow();
      try {
        this.ObjApp.TimingMessage('CALL LAB 送出 ');
        this.windowObj.location.href = url;
      }catch(e) {
        ok = false;
      }finally {
        setTimeout(() => this.windowObj.close(),1000);
        if(ok)
        console.log('');
        //this.ObjApp.TimingMessage('CALL LAB 成功送出 @ ' + url);
        else
        this.ObjApp.TimingMessage('CALL LAB 通知失敗 @ ' + url, 2);
      }
    },
    toggleDetailView() {
      this.showDetails = !this.showDetails;
      //this.$refs.toggleView.$emit('change');
    },
    _removeActiveHistoryCursorPos(keep){
      const el = document.querySelector('.active-history');
      if(!el) return;
      keep ? "" : el.classList.remove('active-history');
      let id = el.id.replace("dtc-history","");
      return [Number(id), el];
    },
    _updateActiveHistoryCursorPos(id) {
      const target = document.querySelector('#dtc-history' + id);
      target.classList.add('active-history');
      target.scrollIntoView();
    },
    goNextHistory () {
      let [id,el] = this._removeActiveHistoryCursorPos();
      id = Number(id) + 1;
      const len = this.historyList.length - 1;
      if (id > len) { 
        el.classList.add('active-history');
        return;
      }
      this._updateActiveHistoryCursorPos(id);
      
    },
    goPrevHistory () {
       let [id,el] = this._removeActiveHistoryCursorPos();
       --id;
       if(id < 0) {
         el.classList.add('active-history');
         return;
       } 
       this._updateActiveHistoryCursorPos(id);
    },
    openHistory () {
       let [id,] = this._removeActiveHistoryCursorPos(true);
       const item = this.historyList[id];
       this.viewHistoryReport(item,id);
    },
    
    async clickSaveSMS() {
      if(!this.whySaveText) {
        //this.ObjApp.TimingMessage('尚未輸入儲存報告原因, 不得存檔.', 2);
        //return;
      }
      this.theReport.ModifyNote = this.modifyOptions.find( s => s.value === this.modifyOpt).text;
      this.theReport.ModifyReasonId = this.modifyOpt;
      setTimeout(() => this.DataSave(999), 0);
      this.$bvModal.hide('add-note-b4-save');
    },
    addNoteB4Save() {
      if(!this.isAbleToModifyReport()) return;
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'info' : 'primary'
			this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['addNoteB4Save'].show()
    },
    showPacsUrl() {
      alert(window.packUrl )
    },
    isAbleToModifyReport() {
      const ok1 = this.theReport.DxreportPhysicianId === this.loginId && this.theReport.DxrStatus == 71;
      const ok2 = this.theReport.IssuePhysicianId === this.loginId && this.theReport.DxrStatus == 71;
      if( ok1 || ok2) return true;
      else return false;
    },
    async getAllRows() {
       if(!window.dtcUrl) {
         return;
       }
       let itemPack = '';
       await new DataManager({
        url: window.dtcUrl,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(window.dtcQuery)
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.filter(i => {
        i.IssueTime = this.DateToString(i.IssueTime, true);
        i.StudyTime =
          i.StudyTime == null ? "無影像" : this.DateToString(i.StudyTime, true);
      });

      itemPack.Items.sort((a, b) => {
        return (
          b.IssueTime - a.IssueTime || a.Status - b.Status
        );
      });

      this.totalArrayLen = itemPack.Items.length;
      this.dxrVersion = `1/` + this.totalArrayLen;

      for(let i = 0; i < window.dtcDataList.length; ++i) {
        let idx = itemPack.Items.length && itemPack.Items.findIndex( s => s.AccessionNo === window.dtcDataList[i].AccessionNo);
        if(!itemPack.Items.length) break;
        if(idx > -1) {
          itemPack.Items.splice(idx,1);
        }
      }
      if(itemPack.Items.length) { 
        this.nextViewArr = [...itemPack.Items];
      }
    },
    getStatus(n) {
      n = Number(n);
      let s = '';
      if ( n == 61) {
        s = "退回重寫";
      }else if ( n == 63) {
        s = "暫存檔案";
      }else if ( n == 65) {
        s = "等待審核";
      }else if ( n == 71) {
        s = "正式報告";
      }
      return s;
    },
		getDropDownStyle () {
			let str = '';
			if(this.isWhite) {
				str="backgrond:white;color:black;";
			}else if(this.isBlack) {
				str = "background:black;color:white;";
			}else {
				str = `background:${this.gray};color:white;`;
			}
			return str;
		},
		clickLeftArrow () {
			const el = document.querySelector('.dtc-toolbar');
			let v = el.scrollLeft - 630;
			v + el.offsetWidth >= el.scrollWidth ? v = el.scrollWidth - el.offsetWidth: '';
			el.scrollLeft = v;
		},
		clickRightArrow () {
			const el = document.querySelector('.dtc-toolbar');
			let v = el.scrollLeft + 630;
			v < 0 ? v = 0: '';
			el.scrollLeft = v;
		},
		resetFullScreenForm () {
      document.querySelector('#WinCST0301DxRSC').reset();
      let item = this.cstTab.find( s => s.CSTName === this.cstTabName);
      if(!item) return;
      item.structureData = '';
		},
		async editHtmlReport(item) {
      let ret = '';
      item ? this.cstTabName = item.CSTName : ret =  this.cstTab.find( s => s.CSTName === this.cstTabName);
      //alert( this.cstTabName)
      if(ret) {
         item = ret;
         //alert(this.cstTabName + item.structureData)
      }else if (item) {
        const t = this.cstTab.find( s => s.CSTName === item.CSTName);
        if(t) {
          this.ObjApp.TimingMessage(`${item.CSTName}已存在,請選擇其他`, 2)
          return;
        }
        this.$refs['reportTemplate'].hide();
				const html = (await window.axios.get('/cst/Get?cstId=' + item.CSTId)).StructureContent;
        item.cstHtml = html;
        this.cstTab.push(item);
      }else {
        return;
      }
      //alert(this.cstTabName + item.structureData)
      //this.cstTabName = item.CSTName;
      this.cstReportHtml = item.cstHtml ; // it contains html only; the data is saved in differnt place
      
      this.$nextTick(()=>{
        console.log(html)

        console.clear();
        console.log(this.$refs["myReportImg"]);

      });

			setTimeout( () => {this.enterFullScreen('#WinCST0301___BV_modal_content_');}, 0);
			this.WinCSTOpen();
		},
		exitFullScreen (_id) {
			//const id = _id ? _id : '#blkReportInput';
			this.showImgReport = false;
			//const el = document.querySelector(id);
			//el.exitFullscreen();
		},
		enterFullScreen (_id) {
			const id = _id ? _id : '#blkReportInput';
      const el = document.querySelector(id);
			el.requestFullscreen();
			this.showImgReport = true;
		},
		getFontColor() {
			if(!this.isGray) return '';
			return "color:blue;"
		},
		bgUpdate(cls){
			this.isWhite = this.isBlack = this.isGray = false;
			if( cls == 'white') {
				this.isWhite = true;
			} else if ( cls == 'black') {
				this.isBlack = true;
			} else {
				this.isGray = true;
			}
			localStorage['theme-modal-bg-color'] = cls;
			this.ThemeSwitch(cls);
			if(!this.isWhite) {
				document.documentElement.style.setProperty('--theme-modal-bg-color', cls);
			}

		},
		async GetVersions() {
			//	以 AccessionNo 取得 各版次之診斷報告 資訊
			this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`);
		},
		
		FocusOnContent() {
			// 設定(報告內容編輯區塊)為焦點所在 ; disable run time error
			setTimeout(() => { this.$nextTick(() => this.$refs['reportPlainText'].focus())}, 500)
    },
    
		getReportPhraseStr(v) {
      if(!this.phraseRecords.length) return "";
      const ret = this.phraseRecords.find( s => s.PhraseCode === v);
			return ret ? ret.Replacement : "";
    },
    
		findReportPhraseStr() {
      const taskObject = this.$refs['reportPlainText'];
      if(!taskObject.value) return;
      const value = taskObject.value.trim();
      const arr = Array.from(value);
      let words = [];
      let end = taskObject.selectionEnd;
      for(let i = end -1 ; -1 < end; --i) {
        if(/^\w+$/.test(value[i])) {
          words = [arr[i], ...words];
        }else {
          break;
        }
        --end;
      }
      const key = words.join('');
      //alert(key)
      const replacement = this.getReportPhraseStr(key);
      if(!replacement) return;
      const len =  value.length - words.length;
      const orig = 1 > len ? "" :  arr.slice(0, taskObject.selectionEnd - key.length).join('');
     // alert(orig)
      let rightStr = 1 > len ? "" :  arr.slice(taskObject.selectionEnd , value.length).join('');
     // alert(rightStr)
      if (rightStr === key) { rightStr = ""}
      this.theReport.ReportContent = orig ? `${orig} ${replacement + rightStr} `  : replacement + " " + rightStr;
      this.theReport.ReportContent = this.theReport.ReportContent.trim();
      taskObject.selectionEnd = this.theReport.ReportContent.length + 1;
    },
    async viewHistoryReport(item,i) {
      this._removeActiveHistoryCursorPos();
      this._updateActiveHistoryCursorPos(i);
      //console.log(JSON.stringify(item,0,2));
      if(item.ReportSource == 'DTC') {
        //get report details;
        this.ObjApp.WaitingShow('報告');
        item = await window.axios.get('/Report/Get?accessionNo=' +  this.theProcedure.AccessionNo);
        this.ObjApp.WaitingHide();
      }
      this.viewHistoryItem = item;
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
			let IsThemeBlack = this.$IsThemeBlack()
			this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['viewHistory'].show();
      setTimeout (  () => {
				const el = document.querySelector('#view-history___BV_modal_content_');
				el.requestFullscreen();
			 }, 200);
       //console.log(JSON.stringify(this.theReport,0,2));
    },
    viewUrgentReport(item) {
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'danger' : 'primary'
			this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['urgentReport'].show();
    }, 
		InstantPhraseCreate() {
			this.instantContent = ''
			let taskObject = this.$refs['reportPlainText']
			if(taskObject) {
				let posB = taskObject.selectionStart
				let posE = taskObject.selectionEnd
				if(posE > posB) {
					this.instantContent = taskObject.value.substring(posB, posE)
					console.log(this.$logs(this.instantContent))
					if(this.instantContent && this.instantContent.length > 0) {
						this.WinMass4Phrase()
					}
				}
			}
		},
		DoThis(methodName, ...args) {
			// 動態呼叫處理
			this.$refs['versionHistory'].hide();
      console.log(this.$logv())
     // const arr = args[0].split('/')
			window.dtcDiff =args[0]
			//alert(JSON.stringify(args));
			this[methodName](args)
		},
		[OutterProprty4DynamicDeclare.name4ContentDiff]: async function(x) {
			// 叫用:報告內容差異比對

			//
			// Pollux, 請參閱[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer]
			//		> 尤其是 (Computed property names) 這個章節
			//	>	注意:
			//	1. Computed property names 在這裡不能使用 data/data() 區段內的 property 來宣告, 因為在此時 data/data() 區段還是 null !
			//		> 因此必須用外部的 property 來宣告 method
			//	2. 但是, 在 template 區段中又不能用外部的 property 來宣告/繫結
			//		> 所以, 可以在 data/data() 或 computed 區段設立 property 並將外部 property 之值 assign 過去,
			//		> 就可以在 template 區段中使用了
			//
			console.log(this.$logs(null, OutterProprty4DynamicDeclare.name4ContentDiff))
			// 如果傳入參數為 array, 則轉換型別為 string
			if(typeof x !== 'string') {
				x = x[0]
      }
      const map = await window.axios.get(`/Report/Get?accessionNo=${this.theProcedure.AccessionNo}&version=${x}`);//this.GetVersionContent(x)
      this.oldStr = map.ReportContent;
			this.newStr = this.theReport.ReportContent
			//
			this.$refs['Window4Diff'].show()

			setTimeout (  () => {
				const el = document.querySelector('#WinDiff0301___BV_modal_content_');
				el.requestFullscreen();
			}, 200);
			

		},
		ThemeSwitch(color) {
			// Theme:Black 切換
			//
			this.themePacks.themeBlack = color !== 'white';
			//
			let activate = this.themePacks.themeBlack
			let className = this.themePacks.themeBlackName
			const el = document.body
			//
			if(activate) {
				el.classList.add(className)
			} else {
				el.classList.remove(className)
			}
			console.log(this.$logs(this.$IsThemeBlack() ? 'Black' : 'White'))
		},
		WinMass4Objective() {
			console.log(this.$logs())
			this.winMassComponent = false
			//
			this.winMassHeadBgV = 'danger'
			this.winMassHeadTxV = 'white'
			//this.winMassBodyBgV = 'dark'
			//
			this.winMassTitle = '醫師客訴'
			this.winMassContent = this.theProcedure.Objective
			this.$refs['Window4Mass'].show()
		},
		WinMass4Subjective() {
			console.log(this.$logs())
			this.winMassComponent = false
			//
			this.winMassHeadBgV = 'info'
			this.winMassHeadTxV = 'white'
			//this.winMassBodyBgV = 'dark'
			this.winMassTitle = '病患主訴'
			this.winMassContent = this.theProcedure.Subjective
			this.$refs['Window4Mass'].show()
		},
		WinMass4Phrase() {
      console.log(this.$logs())
      //WinMass0301___BV_modal_content_"
			this.winMassComponent = true
			//
			this.winMassHeadBgV = 'primary'
			this.winMassHeadTxV = 'white'
			//this.winMassBodyBgV = 'dark'
			this.winMassTitle = '片語維護'
      this.$refs['Window4Mass'].show()
		},
		WinMass4Radiographer() {
			console.log(this.$logs())
			this.winMassComponent = false
			//
			this.winMassHeadBgV = 'warning'
			this.winMassHeadTxV = 'dark'
			//this.winMassBodyBgV = 'dark'
			this.winMassTitle = '檢查註記'
			this.winMassContent = this.theProcedure.RadiographerNote
			this.$refs['Window4Mass'].show()
		},
		WinMass4ShiftNote() {
			console.log(this.$logs())
      console.log(this.theProcedure)
			if(this.ShiftNoteNotice) {
				this.winMassComponent = false
				//
				this.winMassHeadBgV = 'info'
				this.winMassHeadTxV = 'white'
				//is.winMassBodyBgV = 'dark'
				this.winMassTitle = '交班記錄'
        this.winMassContent = this.theProcedure.ShiftNote
				this.$refs['Window4Mass'].show()
			}
    },
    copyPasteText() {
      this.theReport.ReportContent +=  '\n' + this.viewHistoryItem.ReportContent;
      this.showImgReport = false;
      this.$bvModal.hide('view-history');
      this.ObjApp.TimingMessage('資料已複製並貼上');
      
    },
    checkReportContent(num, auto) {
      let ok = true;
      this.theReport.ReportContent = this.theReport.ReportContent ? this.theReport.ReportContent.trim() : '';
  
      if(!this.theReport.ReportContent && !this.cstTabName) {
        auto ? "" :  this.ObjApp.TimingMessage('尚未輸入報告內容, 不得存檔.', 2)
        ok = false;
      }
      
      if(this.origReportContent === this.theReport.ReportContent && !this.cstTabName && num > 900 )  {
        auto ? "" :  this.ObjApp.TimingMessage('報告內容並無異動, 無需存檔.', 2)
        ok = false;
      } else if(!this.theReport.IssuePhysicianId && num >= 65) {
        auto ? "" : this.ObjApp.TimingMessage('尚未選擇審核醫師,不得存檔.', 2);
        ok = false;
      } else if (this.cstTabName) {
        let cstModify = false;
        for(let i = 0; i < this.cstTab.length; ++i) {
          if(this.cstTab[i].structureData !== this.theReport[`StructureData${i+1}`]) {
            cstModify = true;
            break;
          }
        }
        if(!cstModify && this.origReportContent === this.theReport.ReportContent && num > 900  ) {
          auto ? "" :  this.ObjApp.TimingMessage('報告內容並無異動, 無需存檔.', 2)
          ok = false;
        }
      }


      return ok;
    },

    getCstRecords() {
      for(let i = 1 ; i < 7 ; ++i) {
        this.theReport[`StructureData${i}`] = "";
        this.theReport[`StructureContent${i}`] = "";
        this.theReport[`StructureImage${i}`] = "";
        this.theReport[`CSTName${i}`] = "";
        this.theReport[`CSTId${i}`] = "";
      }
      //if(!this.cstTab.length) return;
      this.cstTab.forEach( (s,i) => {
        let idx = i + 1;
        this.theReport[`StructureData${idx}`] = s.structureData ? s.structureData : "";
        this.theReport[`StructureContent${idx}`] = s.cstHtml;
        this.theReport[`StructureImage${idx}`] = s.img ? s.img : '';
        this.theReport[`CSTName${idx}`] = s.CSTName;
        this.theReport[`CSTId${idx}`] = s.CSTId;
      })
    },
		DataSave(num, autoSave) {
      const ok = this.checkReportContent(num, autoSave);
      if(!ok) return;
     
      this.theReport.DxrType = "31" //  31 is html + normal text 
      this.theReport.DxrStatus =  num > 900 ?  71 : num; // if > 900 ; change the offically passed doc
     
      if(!this.theReport.DxreportPhysicianId) {
         this.theReport.DxreportPhysicianId = this.loginId;
      }
      this.save(autoSave);
      //this.FocusOnContent()
    },

    async save(auto) {
      let opStatus = true;
      this.getCstRecords();
      try {
        auto ? "" : this.ObjApp.WaitingShow();
        await window.axios.post(`/report/Save?accessionNos=${this.theProcedure.AccessionNo}`, this.theReport);
      }catch(err) {
        opStatus = false;
      }finally {
        if(auto) return;
        this.ObjApp.WaitingHide();
        if(opStatus) {
          this.ObjApp.TimingMessage('資料已完成存檔作業');
          this.continuousReportCode == 'N' ? '' : this.viewNextRecord(true);  
        } else {
          this.ObjApp.TimingMessage('存取時發生錯誤!' + '! 請稍後再試.', 2)
        }
      }
			return opStatus
    },
    
		HelpShow() {
			// 按鈕:功能說明
			/*
			// 20191023.0850 Pollux, 只是框架和測試...
			console.log(this.$logv())
			let content = "<h4>Hotkey</h4><hr class='mb-1'><b-row>HTML 測試: 中文 + <kbd>Samples</kbd> + English</b-row>"
			this.ObjApp.HelpShow({
				Content: content
			})
			*/
			// 20191029 Pollux, 這功能的說明會太複雜了, 用 local 的先, 日後再思考怎麼改?
			this.WinHelpSelf()
    },
    backToPreviousRoute () {
      this.$router.push("/MI03/FI0304")
    },
		WinHelpSelf() {
			console.log(this.$logs())
			//
			let IsThemeBlack = this.$IsThemeBlack()
			this.winConfig4HotkeyDetect.Title = '功能說明'
			this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? 'light' : 'light'
			//
			this.$refs['WinHelp'].show()
		},
		HKWatch(event) {
			// 熱鍵 vs. 功能 分派器
			//console.log(this.$logs())
			//
			// 取得 自訂按鍵辨識字串
			let keyCombine = KeyPressIdentifier(event)
			if(!keyCombine) {
				return
			}
			//
			// HotKey 機制之開啟或閉鎖機制
			if(!this.allowHotKeyFunctional) {
				console.log(this.$logs('OFF'))
				return
			}
			//
			//this.HotkeyPressed = keyCombine
      let runMethod = null
      let param = '';
			this.HotkeyList.some(e => {
				if(e.hotkey === keyCombine) {
          runMethod = e.method
          param = e.param;
					return true
				}
			})
			//
			if(runMethod) {
				console.log(this.$logs(runMethod))
				event.preventDefault()
				this[runMethod](param)
			}
		},
		BMWatch(bvEvent, modalId) {
			if(modalId === 'WinCST0301' && bvEvent.type === 'shown') {
        const item = this.cstTab.find( s => s.CSTName === this.cstTabName);
        if(!item) return;
        const myData = item.structureData;
        //alert(myData);
        if(!myData) return;
        window.dtcCurrentCstData = window.cstResultStr = myData;
				let valueSet = JSON.parse(myData);
				if(valueSet && valueSet.length > 0) {
					valueSet.forEach(e => {
						let item = $(`#WinCST0301DxRSC [name="${e.name}"]`)
						if(item && item.length > 0) {
							let detail = item[0]
							if(',INPUT,TEXTAREA,SELECT,'.indexOf(`,${detail.tagName},`) >= 0) {
								if(detail.type === 'radio' || detail.type === 'checkbox') {
									$.each(item, (index, content) => {
										if(content.value === e.value) {
											content.checked = true
											return false
										}
									})
								} else {
									item.val(e.value)
								}
								//
							}
						}
          });
          
				}
			//
			}
			//
			if(modalId === 'WinConfig') {
				if(',shown,'.indexOf(`,${bvEvent.type},`) >= 0){
					this.allowHotKeyFunctional = false
				} else if(',hidden,'.indexOf(`,${bvEvent.type},`) >= 0) {
					this.allowHotKeyFunctional = true
				}
				return
			} else if(modalId === 'WinHotkeyDetect0301') {
				if(',shown,'.indexOf(`,${bvEvent.type},`) >= 0){
					this.UnderHotkeyDetect = true
					window.removeEventListener('keydown', this.HKWatch)
					window.addEventListener('keydown', this.KeyPressInterceptor)
				} else if(',hidden,'.indexOf(`,${bvEvent.type},`) >= 0) {
					window.removeEventListener('keydown', this.KeyPressInterceptor)
					window.addEventListener('keydown', this.HKWatch)
					this.UnderHotkeyDetect = false
				}
				return
			} else if(modalId === 'WinWait') {
				// 只是遮罩, 無須處理
				return
			}
			//
			this.allowHotKeyFunctional = ',show,shown,'.indexOf(`,${bvEvent.type},`) < 0
		},
		KeyCode2Text(code) {
			// 轉換 自訂按鍵辨識字串 為 html tag 值, 以利在畫面上突顯呈現
			let value = ''
			if(code.indexOf(KeyCode4Control) >= 0) {
				value += '<kbd>Ctrl</kbd> + '
				code = code.replace(KeyCode4Control, '')
			}
			if(code.indexOf(KeyCode4Alternate) >= 0) {
				value += '<kbd>Alt</kbd> + '
				code = code.replace(KeyCode4Alternate, '')
			}
			if(code.indexOf(KeyCode4Shift) >= 0) {
				value += '<kbd>Shift</kbd> + '
				code = code.replace(KeyCode4Shift, '')
			}
			if(code && code.length > 0) {
				value += `<kbd>${code === ' ' ? 'Space' : code}</kbd>`
			}
			//
			if(!value || value.length <= 0) {
				return '(尚未設定)'
			}
			return value
		},
		Item4Config(e) {
			// 開啟 熱鍵取值 視窗
			console.log(this.$logs(e))
			//
			this.HotkeyCurrentItemName = e
			//
			let IsThemeBlack = this.$IsThemeBlack()
			let textVariant = IsThemeBlack ? 'warning' : 'primary'
			let currentValue = ''
			let defaultValue = ''
			this.HotkeyTempSet.some(el => {
				if(el.title === e) {
					currentValue = this.KeyCode2Text(el.hotkey)
					defaultValue = this.KeyCode2Text(el.default)
				}
			})
			this.HotkeyPressRemark = `<span class="text-${textVariant}">目前設定值為 ${currentValue} 預設值為 ${defaultValue}</span>`
			//
			this.HotkeyPressed = ''
			this.HotkeyPressMessage = '等待 您的輸入...'
			//
			this.winConfig4HotkeyDetect.Title = '個人化 Hotkey 設定'
			this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack ? 'info' : 'primary'
			this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? 'light' : 'light'
			//
			this.$refs['WinHotkeyDetect'].show()
		},
		WinConfigOpen() {
			// 開啟 組態設定 視窗
			console.log(this.$logs())
			//
			this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
			//
			let IsThemeBlack = this.$IsThemeBlack()
			//this.winConfigure.Title = '組態設定'
			this.winConfigure.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winConfigure.HeadTxV = IsThemeBlack ? 'light' : 'light'
			//
			this.$refs['WinConfig'].show()
		},
		reportTemplateOpen () {
      if(!this.isCtMri) return;
			this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
			let IsThemeBlack = this.$IsThemeBlack()
			this.winConfig4ReportTemple.Title = '癌症報告'
			this.winConfig4ReportTemple.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winConfig4ReportTemple.HeadTxV = IsThemeBlack ? 'light' : 'light'
			//
			this.$refs['reportTemplate'].show()
		},
		versionHistoryOpen() {
      if(!this.reportHistory.length) {
        this.ObjApp.TimingMessage('無報告版次', 2)
        return;
      }
			this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
			let IsThemeBlack = this.$IsThemeBlack()
			this.winConfig4VersionHistory.Title = '版本歷史';
			this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
			this.$refs['versionHistory'].show();
		},
		WinIQControlEdit() {
			// 開啟 影像品質 資訊編輯視窗
			console.log(this.$logs())
			//
			let IsThemeBlack = this.$IsThemeBlack()
			//this.winIQControl.Title = '影像品質'
			this.winIQControl.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winIQControl.HeadTxV = IsThemeBlack ? 'light' : 'light'
			//
			this.$refs['WinIQControl'].show()
		},
		WinCSTOpen() {
			if(this.fullScreen) {
				return;
			}
			this.showImgReport = true;
			let IsThemeBlack = this.$IsThemeBlack()
			//this.winConfig4StructureReport.Title = '影像品質'
			this.winConfig4StructureReport.HeadBgV = IsThemeBlack ? 'success' : 'primary'
			this.winConfig4StructureReport.HeadTxV = IsThemeBlack ? 'light' : 'light'
			this.$refs['WinCST'].show()
    },
		saveFullScreenForm () {
      if(!document.querySelector('#WinCST0301DxRSC')) return;
      let valueSet = "";
      let valueString = "";
      let item = '';
      try {
        item = this.cstTab.find( s => s.CSTName === this.cstTabName);
        valueSet = $(`#WinCST0301DxRSC`).serializeArray()
        valueString = valueSet ? JSON.stringify(valueSet) : ''
        item.structureData = valueString; 
        window.cstResultStr = valueString;
      }catch(e) {
        item.structureData = '';
        return;
      }
      //this.DataSave(this.theReport.DxrStatus , true);
		},
		WinCSTHide() {
      this.saveFullScreenForm();
			const color = this.isWhite ? 'white' : (this.isBlack ? 'black' : this.gray);
			const img = document.querySelector('.img-border');
			const ops = {
				backgroundColor: color
			}
			
			html2canvas(document.querySelector("#my-report-img"), ops).then(canvas => {
        this.reportImg = canvas.toDataURL();
        let idx = this.cstTab.findIndex( s => s.CSTName === this.cstTabName);
        this.cstTab[idx].img = this.reportImg;
        const myId = `#t-${this.cstTabName}`;
        document.querySelector(myId).click();
				document.querySelector("#blkReportInput").scrollTop = 0;
        img.style.border = "1px solid " +  (color != 'white' ? 'white' : 'blue');
        this.saveFullScreenForm();
        if(this.theReport.DxrStatus == 71) return;
        this.DataSave(this.theReport.DxrStatus , true);
			});
		},
		KeyPressInterceptor(e, debugMode = false) {
			// 熱鍵取值框 的 按鍵攔截處理
			//	- 基本邏輯跟 KeyPressIdentifier.js 差不多, 但細部處理不同, 所以得重寫一份
			//
			if(debugMode) console.log(this.$logs())
			if(debugMode) console.log(`> key(${e.key}), keyCode(${e.keyCode}), code(${e.code}) @ location(${e.location})`)
			//
			// 停止預設功能
			//	- 20191028 Pollux, 在這裡得先強迫不執行按鍵的預設行為, 才不會干擾到取值作業
			//	- !! 還是有按鍵是無法攔截或停止預設行為的, 通常是作業系統的操作鍵, 如: Alt-F4, Alt-Tab, ...
			//	- event 是預設傳入的參數
			event.preventDefault()
			//
			// 發生了新的按鍵事件, 先重置畫面上的相關資訊
			this.HotkeyPressed = ''
			this.HotkeyPressMessage = '等待 您的輸入...'
			//
			let code = e.key
			//
			// 排除三大複合鍵
			if(',Alt,Control,Shift,'.indexOf(',' + code + ',') >= 0) {
				return null
			}
			//
			if(',CapsLock,Escape,Meta,NumLock,Process,Tab,Home,End,PageUp,PageDown,ArrowUp,ArrowDown,ArrowLeft,ArrowRight,Insert,Delete,Enter,ScrollLock,Pause,ContextMenu,'.indexOf(',' + code + ',') >= 0) {
				// 特定功能鍵直接不處理
				this.HotkeyPressed = ''
				this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'><kbd>${code}</kbd></span>, <span>不得設為 hotkey !</span>`
				this.ObjApp.TimingMessage(`按鍵[${code}]為特定功能鍵, 不得設為 hotkey !`, 2)
				return null
			}
			//
			// 用這個變數來組出最終的比對標的
			let keyCombine = ''
			let interpret = ''
			// 複合性功能鍵判斷, 依序為: 1.Contral, 2.Alt, 3.Shift
			if(e.ctrlKey) {
				keyCombine += KeyCode4Control
				interpret += '<kbd>Ctrl</kbd> + '
			}
			if(e.altKey) {
				keyCombine += KeyCode4Alternate
				interpret += '<kbd>Alt</kbd> + '
			}
			if(e.shiftKey) {
				if(!(RegExp(/[`!@#$%^&*()_+}{|":?/><]/).test(code) || (code.length === 1 && RegExp(/[A-Z]/).test(code)))) {
					keyCombine += KeyCode4Shift
					interpret += '<kbd>Shift</kbd> + '
				} else {
					if(debugMode) console.log(this.$logs('Shift 被排除了!'))
				}
			}
			//
			code = code.toUpperCase()
      keyCombine += code
      interpret += this.KeyCode2Text(code)
      const blockKeyPair = ['KC.P', 'KC.F', 'KC.KS.P', 'KC.E', 'KC.K', 'KC.J', 'KC./', 'KC.Z', 'KC.Y'];
			//
			if(keyCombine.length== 1 && (
				//gExp(/[`!@#$%^&*()_+}{|":;'?/><\[\],.\-=]/).test(keyCombine) ||
				RegExp(/[`!@#$%^&*()_+}{|":;'?/><[\],.\-=]/).test(keyCombine) ||
				RegExp(/[0-9]/).test(keyCombine) ||
				RegExp(/[A-Z]/).test(keyCombine) ||
        keyCombine === ' '               
			)) {
				this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`
				return
			}else if ( blockKeyPair.find( s => s == keyCombine.trim())) {
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`
        return
      }
      // }else if(keyCombine >= 3) {
      //   this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`
			// 	return
      // } 
      
      
			//
			this.HotkeyPressed = keyCombine
			this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>`
			if(debugMode) console.log(this.$logs(`this.HotkeyPressed=[${this.HotkeyPressed}]`))
		},
		//
		// 熱鍵取值框 事件處理
		//	- 請小心注意 事件 的執行順序...
		//
		ModalOk(bvModalEvt) {console.log(this.$logs())},
		ModalCancel(bvModalEvt) {console.log(this.$logs())},
		ModalClose(bvModalEvt) {
			this.UnderHotkeyDetect = false
			//console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
		},
		ModalHide(bvModalEvt) {
			//console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
			if(this.UnderHotkeyDetect) {
				bvModalEvt.preventDefault()
			}
		},
		setDefaultBackgroundColor() {
			// 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
			let cls =localStorage['theme-modal-bg-color'];
			this.isWhite = cls == 'white' || !cls;
			this.isBlack = cls == 'black';
			this.isGray = !this.isWhite && !this.isBlack && cls;	
			!cls ? cls = 'white' : '';
			this.ThemeSwitch(cls);
			if(!this.isWhite) {
				document.documentElement.style.setProperty('--theme-modal-bg-color', cls);
			}
			document.addEventListener('fullscreenchange', () => {
			  let timer = '';
        document.querySelector("#blkReportInput").scrollTop = 0;
				if (document.fullscreenElement) {
          this.fullScreen = true;
          timer = setInterval( () => {
            this.saveFullScreenForm();
            if(window.dtcCurrentCstData != window.cstResultStr && this.theReport.DxrStatus != 71 ) {
              window.dtcCurrentCstData = window.cstResultStr;
              this.DataSave(this.theReport.DxrStatus, true);
            }
          }, 10 * 1000);
				} else {
          this.fullScreen = false;
          //this.$bvModal.hide('WinCST0301');
          document.querySelector('.close').click();
         
          clearInterval(timer);
          window.dtcCurrentCstData = window.cstResultStr ;
				}
			});
		},
		//
		EndOfKPInterceptor() {
			// 熱鍵設定完成後, 存入暫時組態集
			console.log(this.$logs(this.HotkeyCurrentItemName))
			//
			let newHotkey = this.HotkeyPressed
			// 如新熱鍵不為空值, 先清掉重複的
			if(newHotkey && newHotkey.length > 0) {
				this.HotkeyTempSet.forEach(e => {
					if(e.hotkey === newHotkey) {
						e.hotkey = ''
					}
				})
			}
			// 找到對應項目, 設入新熱鍵值
			this.HotkeyTempSet.some(e => {
				if(e.title === this.HotkeyCurrentItemName) {
					e.hotkey = this.HotkeyPressed
					console.log(this.$logs(`${this.HotkeyCurrentItemName} > ${e.hotkey}`))
					return true
				}
			})
			// 關閉熱鍵取值框
      this.UnderHotkeyDetect = false
      this.HotkeyConfigSave();
			this.$refs['WinHotkeyDetect'].hide()
		},
		HotkeyConfigReset() {
			this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
			this.ObjApp.TimingMessage('組態設定已回復原值')
		},
		async HotkeyConfigDefault() {
      this.HotkeyTempSet = this.HotkeyList = [...defaultHotKeyArr];
			this.HotkeyTempSet.forEach(e => {
				e.hotkey = e.default
      })
      this.ObjApp.TimingMessage('Hotkey組態設定已重置成系統設定');
      //this.HotkeyList = [...defaultHotKeyArr];
      let obj = {EmployeeNo:this.loginId, PersonalSetting: '' };
      await window.axios.put(`/employee/SavePersonalSetting?employeeNo=${this.loginId}`, obj);
		},
		async HotkeyConfigSave() {
			this.HotkeyList = this.$DeepCopy(this.HotkeyTempSet)
      let param = { AccId: this.UserId, Setting: JSON.stringify(this.HotkeyList) }
      try{ 
        this.ObjApp.WaitingShow()
        let obj = {EmployeeNo:this.loginId, PersonalSetting: JSON.stringify(param) };
        await window.axios.put(`/employee/SavePersonalSetting?employeeNo=${this.loginId}`, obj);
        let okMessage = `組態設定已完成`
				this.ObjApp.TimingMessage(okMessage)
      }catch(e) {
        this.ObjApp.TimingMessage('組態設定 FAIL')
      }finally {
        this.ObjApp.WaitingHide()
      }		
		},
	
    getDataFromStore() {
      if(!window.dtcDataList || !window.dtcDataList.length || this.currentNum < 1 ) {
        this.$router.replace({ name: "FI0304" });
        return;
      }

      if(!this.initArray.length) {
        this.initArray = [...window.dtcDataList];
      }else if(this.nextViewArr && this.nextViewArr.length) {
        this.initArray = [...this.initArray, ...this.nextViewArr];
        this.nextViewArr= [];
      }
      
      //console.log(JSON.stringify(d,0, 2));
      const d = Object.assign({},this.initArray[this.currentNum - 1]);
      console.log('getDataFromStore ' + JSON.stringify(d,0, 2));
      this.theProcedure.AccessionNo = d.AccessionNo;
      const dummyArr = ['','',''];
      const [t1, t2, ] =  d.ProcedureCompleted && d.ProcedureCompleted.split? d.ProcedureCompleted.split(':') : [...dummyArr];
			this.theProcedure.StudyDate = t1 ? [t1,t2].join(':') : d.ProcedureCompleted;
			this.theProcedure.Modality = d.Modality
			this.theProcedure.PatientId = d.PatientId
      this.theProcedure.PatientSourceType = d.PatientSourceTypeCode + "-"  +  d.PatientSourceTypeName
      this.theProcedure.PatientName = d.PatientName
			this.theProcedure.PatientSex = d.PatientSex
			this.theProcedure.BedNo = d.BedNo ? d.BedNo : '暫無記錄'
			this.theProcedure.RequestingPhysicianName = d.RequestingPhysicianName
			this.casePriorityCode = d.EmgFlag
			this.labProcedures = d.ProcedureName
			this.theProcedure.Subjective = d.Subjective
			this.theProcedure.Objective = d.Objective
			this.theProcedure.RadiographerNote = d.RadiographerNote
			this.theProcedure.ShiftNote = d.ShiftNote;
      this.theProcedure.StatusName = d.StatusName
      this.statusName = d.StatusName;
      this.theProcedure.PatientAge = d.PatientAge;
      this.theProcedure.DeviceName = d.DeviceName;
      this.theProcedure.PatientBirthday = this.DateToString(new Date(d.PatientBirthday));
    },

    normalizeReportData () {
      this.isDataChange = false;
      this.historyList = [];
      this.reportHistory  = [];
      this.cstTabName = "";
      this.cstTab = [];
      // hold the data for comparing in saving 
      this.origReportContent = this.theReport.ReportContent ?  this.theReport.ReportContent.trim() : "";
    
      // check CST img ; if has, display img now
      //this.reportImg = this.DxRStructureImage;
      this.reportImg = this.theReport.StructureImage1;
      if(this.reportImg) {
         this.showImgReport = true;
         this.cstReportHtml = '' + this.theReport.StructureContent1;
         let arr = [];
         for(let i = 1; i < 7; ++i) {
           if(!this.theReport[`StructureContent${i}`]) break;
           let obj = {cstHtml:'', img:'', structureData:'',CSTName:''};
           obj.structureData = this.theReport[`StructureData${i}`];           
           obj.img = this.theReport[`StructureImage${i}`];
           obj.cstHtml = this.theReport[`StructureContent${i}`];
           obj.CSTName = this.theReport[`CSTName${i}`] ? this.theReport[`CSTName${i}`] : "Name-dtc-tab-" + i ;
           obj.CSTId = this.theReport[`CSTId${i}`] ? this.theReport[`CSTId${i}`] : "ID-dtc-tab-" + i ;
           arr.push(obj);
         }
         this.cstTab = [...arr];
         this.cstTabName = this.cstTab[0].CSTName;
      }

     
      if(!this.theReport.OrderNo) {
        this.theReport.OrderNo = this.theReport.AccessionNo.split('_')[0]
      }

      this.origDxStatus = this.theReport.DxrStatus; // use for debug only

      if(!this.theReport.DxrStatus) {
        this.theReport.DxrStatus = 63;
       
      }

      if(!this.theReport.DxrVersion) {
        this.theReport.DxrVersion = "1";
      }

      this.theReport.PatientId = this.theProcedure.PatientId ? this.theProcedure.PatientId : '' + new Date().getTime();

      if(!this.DxReportIQCode ) {
        this.DxReportIQCode  = "30";
      }
      
      if(!this.theReport.IssuePhysicianId && this.canApproveReport) {
        this.theReport.IssuePhysicianId = this.loginId;
      }
      this.callPacs("show");
      setTimeout( async () => {
        try {
          this.loadingHistory = true;
          this.historyList  = await window.axios.get('/Report/GetParentReportList?parentId='+  this.theProcedure.PatientId);
          this.loadingHistory = false;
        }catch(err) {
          this.ObjApp.TimingMessage(`歷史診斷報告 API (/Report/GetParentReportList) 發生錯誤: ${err.message}`, 2);
          this.loadingHistory = false;
        }
      });
      setTimeout( async () => {
        try {
          this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`);
        }catch(err) {
          this.ObjApp.TimingMessage(`報告版次 API (/Report/GetVersionList) 發生錯誤: ${err.message}`, 2);
        }
      });
     
    },

    async viewRecordByCurrentNumber() {
      this.cstReportHtml = this.reportImg = this.showImgReport = '';
      this.getDataFromStore();
      this.dxrVersion = `${this.currentNum}/${this.totalArrayLen}`;
      this.ObjApp.WaitingShow('報告');
      try {
        this.theReport = await window.axios.get('/Report/Get?accessionNo=' +  this.theProcedure.AccessionNo);
      }catch(err) {
        this.ObjApp.TimingMessage(`viewRecordByCurrentNumber 發生錯誤: ${err.message}`, 2);
      }
      this.ObjApp.WaitingHide();
      this.normalizeReportData();

    },

    openPopupWindow() {
      const height = 5;
      const width = 5;
      const t = innerHeight-height;
      const l = innerWidth-width;
      this.windowObj = window.open('DTC:PACK','PACS',`height=10,width=10,left=${l},top=${t},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no, status=no`);
    },

    async callPacs(str) {
      let ok = true;
      this.openPopupWindow();
      try { 
        str == "show" ? "" : this.ObjApp.TimingMessage('已呼叫PACS');
        const url = await window.axios(`/api/PacsUri/` + this.theProcedure.AccessionNo);
        window.packUrl = url;
        this.windowObj.location.href = url;
      }catch(err) {
         ok = false;
      }
      finally {
        setTimeout(() => this.windowObj.close(),1000);
        if(ok) {
          //this.ObjApp.TimingMessage('已呼叫PACS @ ' + url);
        }else if(process.env.NODE_ENV === "production"){
          this.ObjApp.TimingMessage('呼叫PACS發生錯誤',2);
        }
      }
    },
    async viewNextRecord (redirect) {
      ++this.currentNum;
      if(this.currentNum > this.totalArrayLen) {
        --this.currentNum;
        if (redirect) this.$router.replace({ name: "FI0304" });
        return;
      }
      this.viewRecordByCurrentNumber();
    },
    async viewPrevRecord () {
      --this.currentNum;
      if(this.currentNum < 1) {
        ++this.currentNum;
        return;
      }
      this.viewRecordByCurrentNumber();
    },
    initCmp () {
      // 取得 App.vue 參照
      let obj = this.$GetApp(this)
      this.ObjApp = obj[0]
      this.VueNestLevel = obj[1]
    
      // 宣告監聽器:攔截 KeyPress
      window.addEventListener('keydown', this.HKWatch);

    },
    async getHotKeySetting() {
      try {
        this.HotkeyList = [];
        const map = await window.axios.get(`/employee/GetPersonalSetting?employeeNo=${this.loginId}`);
        const jsonObj = JSON.parse(map);
        // might throw error below since the it might has no seeting at all .
        const a = JSON.parse(jsonObj.Setting);
        this.HotkeyList = [...a];
      }catch(e) {
        //alert('get personal setting fail ajax');
      }finally {
        if(!this.HotkeyList.length ) this.HotkeyList = [...defaultHotKeyArr];
      }
      //  // 20200121.1819 Pollux,
      // //  1. 以預設 hotkey 集與個人設定比較
      // //  2. 先只做 hotkey 值不同的校對, 應再多設想一下還有那些狀況得處理?
      // let IsModified = false
      // let tempHotkeySet = []
      // defaultHotKeyArr.forEach(s => {
      //   let itemHotkey = s.hotkey
      //   let itemDefault = s.default
      //   let itemMethod = s.method
      //   let itemTitle = s.title
      //   //
      //   this.HotkeyList.forEach(i => {
      //     if(i.method === s.method){
      //       if(i.hotkey !== itemHotkey) {
      //         itemHotkey = i.hotkey
      //         console.log(this.$logs(`${s.hotkey} > ${itemHotkey}`, 'getHotKeySetting'))
      //         IsModified = true
      //       }
      //     }
      //   })
      //   //
      //   tempHotkeySet.push({ hotkey: itemHotkey, default: itemDefault, method: itemMethod, title: itemTitle })
      // })
      // //
      // if(IsModified) {
      //   // 有變動, 用整理後的設定集合蓋回去
      //   this.HotkeyList = tempHotkeySet
      //   // TODO: save back to personal setting
      // }
    },
    async saveFile() {
      if(!this.isDataChange ||  this.theReport.DxrStatus == 71) return;
      this.isDataChange = false; 
      await this.DataSave(63,true);  
    }
  },
  
	async beforeMount () {
    this.$root.$on('dtc-copy-paste', s => {
      if(this.showImgReport) return;
      if(!this.theReport.ReportContent) this.theReport.ReportContent = "";
      this.theReport.ReportContent  += "\n" + s;
     
    });
    //document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
   
    try{
      this.theReport = {};
      //Step 1
      this.getDataFromStore(true); // it will get accession # for step 1-1
      //Step 1-1: get latest report from  accession #
      this.ObjApp.WaitingShow('報告');
      this.theReport = await window.axios.get('/Report/Get?accessionNo=' +  this.theProcedure.AccessionNo);
       //Step 3 get ApprovalPhysicianName list for dropdown menu
      const map = await window.axios.get('/Employee/SelectNoList?staffType=21');
      let arr = [ {value:null, text:'請選擇...'}];
      map.Items.forEach( s => {
        arr.push({value: s.No, text:s.Name}); 
      });
      //normalize array to dislay
      this.approvalList = arr;
      this.normalizeReportData();
      this.ObjApp.WaitingHide();

       //step 5 get CST list; CancerScreeningTemplate
      this.reportList = await window.axios.get('/cst/List');

     
      
      //step 4. get 影像品質清單API
      let imgs = await window.axios.get('/GeneralData/SelectNoList?groupNo=ImageQuality');
      arr = [];
      imgs = imgs.Items;
      imgs.forEach(s => {
        arr.push({value:s.No, text: s.Name});
      })
      //normalize array to dislay
      this.optionsImageQuality = arr;
       // Step 6: get all rows for performance cache
      await this.getAllRows();
      //get all report phrase
      const p1 = await window.axios.get(`/reportPhrase/Get?$top=165534`);
      const p2 = await window.axios.get(`/reportPhrase/Get?$top=165534&&employeeNo=${this.loginId}`);
      this.phraseRecords = [...p1.Items, ...p2.Items];
      this.$root.$on("reload-report-phrase", async () => {
        const p1 = await window.axios.get(`/reportPhrase/Get?$top=165534`);
        const p2 = await window.axios.get(`/reportPhrase/Get?$top=165534&&employeeNo=${this.loginId}`);
        this.phraseRecords = [...p1.Items, ...p2.Items];

      });

      }catch(err) {
        this.ObjApp.TimingMessage(`API 發生錯誤: ${err.message}`, 2);
        //alert(err.message);
      }
     
	},
	async created() {
    this.initCmp();
    this.getHotKeySetting();
    setInterval(() => this.saveFile(), 10 * 1000);
    
	},
	mounted() {
    console.log(this.$logs());
		const el = document.querySelector('.dtc-toolbar');
		el.onscroll = ()  => {
			this.leftMost = !el.scrollLeft ? true : false;
			this.rightMost = el.scrollLeft + el.offsetWidth == el.scrollWidth ? true : false;
			//console.log(el.scrollLeft + el.offsetWidth);
		};
		//
		// 設定 b-modal listeners
		this.$root.$on('bv::modal::show', this.BMWatch)
		this.$root.$on('bv::modal::shown', this.BMWatch)
		this.$root.$on('bv::modal::hide', this.BMWatch)
		this.$root.$on('bv::modal::hidden', this.BMWatch)
		
		// 先留下解析度資訊, 日後或許有用...
		console.log(this.$logs(`BView:${document.body.clientWidth}x${document.body.clientHeight}`))
		console.log(this.$logs(`WView:${window.innerWidth}x${window.innerHeight}`))
		
		this.setDefaultBackgroundColor();
		
	
		//
		// 自動 focus 到 (報告內容編輯區塊)
		this.FocusOnContent()
		//
		
	},
	destroyed() {
		console.log(`${this.$logs()}`)
		// 解除監聽器:攔截 KeyPress
		window.removeEventListener('keydown', this.HKWatch)
		window.removeEventListener('keydown', this.KeyPressInterceptor)
		// 解除 Theme:Black
		const el = document.body
		el.classList.remove(this.themePacks.themeBlackName)
		// 解除 b-modal listeners
		this.$root.$off('bv::modal::show', this.BMWatch)
		this.$root.$off('bv::modal::shown', this.BMWatch)
		this.$root.$off('bv::modal::hide', this.BMWatch)
		this.$root.$off('bv::modal::hidden', this.BMWatch)
		//
  },
  watch : {
    urgentOpt(v) {
      if(v != 6) {
        this.otherInput = '';
      }
    },
    'theReport.IsPositive'(v, o) {
      if(v !== o)
        this.DataSave(this.theReport.DxrStatus, true);
    },
    showDetails(v) {
      const els = [...document.querySelectorAll('.sb4RHis')];
      if(!v) {
        els.forEach( el => {
          el.classList.add('sb4Hide');
        })
      }else {
        els.forEach( el => {
            el.classList.remove('sb4Hide');
        });
      }
    },
    'theReport.ReportContent'() {
      if(this.theReport.ReportContent && !this.showImgReport) {
        if( this.theReport.DxrStatus == 71) {
          this.isDataChange = false;
        }else {
          this.isDataChange = true;
        }
      }
    },
    
  }
}
</script>

<style lang="scss">
#FI0301 ::-webkit-scrollbar {
  	width: 0px;  /* Remove scrollbar space */
		background: transparent;  /* Optional: just make scrollbar invisible */
}
.text-black {
	color:black !important;
}
#app .themeBlack  a {
	color: white !important;
}
#WinCST0301___BV_modal_header_ {
	.close {
		display:none;
	}
}

#WinCST0301___BV_modal_content_, #WinMass0301___BV_modal_content_{
	width:100vw;
	height:100vh;
}

#dropdown-1__BV_toggle_{
	font-size:12px !important;
	padding: 2px 8px !important;
	margin-left: 12px;
	margin-right: 12px;
	margin-top:-3px;
}
</style>

<style scoped>

/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text { background-color: rgba(0, 0, 0, .7 ); color: rgba(255, 255, 255, .7 ); }

.cardHeader {
  padding: 0 1.25rem;/*2px 1.25rem;*/
  white-space: nowrap;
}

.scrollBox {
	width: 100%;
	height: 132px;/*132px*/
	white-space: nowrap;
	overflow: auto;
}

.sb4RHis {
	width: 100%;
	height: calc(100vh - 440px);
	overflow: auto;
}

.sb4Hide {
  min-height: calc(100vh - 300px) !important;
}

/* -- */
.blink {
  animation: blink-animation 1s ease-in-out infinite;
}

@keyframes blink-animation {
  to {
     opacity: 0;
  }
}

</style>

<style lang="scss" scoped>

#blkReportInput {
	position: relative;
	overflow:auto;
	.sticky {
		position:absolute;
	    right: 22px;
		top:5px;
		width: auto;
		height:auto;
		z-index:3;
		cursor: pointer;
	}
	.full {
		position:sticky;
		right: 12px;
		top: 25px;
		width: auto;
		height:auto;
		z-index:3;
	}
	> div {
		z-index: 1;
	}
	img {
		position:absolute;
		display:block;
		z-index:2;
		top:0;
		right:0;
		bottom:0;
		left:0;
		width:100%;
		height:auto;
		object-fit: contain;
	}
}
</style>

<style lang="scss">
.dropleft .dropdown-menu {
	max-height: 480px;
	overflow: auto;
}

.title-grid {
	display:grid;
	grid-template-columns: 160px 500px;
	grid-gap: 100px;

}

.main-toolbar {
	position: relative;
}

.dtc-toolbar {
    position:absolute;
	left: 530px;
	margin-left:32px;
	overflow-x:auto;
	display:flex;
	flex-wrap: nowrap;
	min-width:800px;
	width:800px;
	max-width:800px;
  overflow-x: -moz-hidden-unscrollable;
	> * {
		display:inline-block;
	}
	> button {
		width:120px;
		min-width:120px;
	}
	&::-webkit-scrollbar {
		width: 0px;  /* Remove scrollbar space */
		background: transparent;  /* Optional: just make scrollbar invisible */
	}
	
}


.dtc-arrow {
	position:absolute;
	width:20px;
	height:20px;
	color:white;
	font-weight: 800px;
	line-height: 60px;
	transform: translateY(-50%);
	cursor: pointer;
	display:block;
}

.left-arrow{ 
	left:535px;

}

.right-arrow {
	left: 1370px;
}

.img-border {
  display:inline-block;
	object-position: top left;
  width:100%;
  height:100%;
}

.dtc-back {
	position:absolute;
	right:12px;
	top:0px;
	display:block;
	width:100px;
	height:38px;
}
@media (max-width: 1506px) {
	.dtc-back {
		margin-top: -50px;
	}
}
.dtc-his-grid {
  display:grid;
  grid-template-columns: 2fr 1fr;
  //grid-row-gap: 15px;
  > div {
    margin-bottom: 5px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 6px;
    height:28px;
    cursor: pointer;
    padding-top: 3px;
  }
}
.wired-content {
  display:flex;
  flex-direction: column;
  line-height: 2rem;
  font-size:1.5rem;
  > * {
    margin:1.2rem 0;
  }
  textarea {
    min-width:90vw;
    min-height: calc(100vh - 230px);
  }
}
.view-history-pop {
  display:flex;
  padding-top: 30px;
  font-size: 24px;
  .block {
    margin-bottom: 20px;
  }
  .left,.right {
    flex: 1;
    flex-direction: column;
    textarea{
      height:calc(100vh - 300px);
    }
  }
  .left {
    flex: 0 0 500px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .v-grid {
    display:grid;
    grid-template-columns: repeat(3, max-content max-content);
    grid-gap: 16px;
    margin-bottom: 20px;
  }
}

.urgent-opt {
   margin-top: 16px;
   margin-left: 16px;
   > label {
     display:inline-block;
     margin-left: 13px;
     margin-top: 4px;
     background:transparent !important;
   }
   .input {
     margin-left: 12px;
     width: 600px;
   }
   input[type=radio] {
      transform: scale(1.5);
   }
}
 .sms-input {
     margin-top: 15px;
     margin-bottom: 15px;
     display:inline-block;
     margin-left: 16px;
     width: 680px;
     height: 200px;
}
.urgent-btns {
  display:grid;
  grid-template-columns: max-content 140px max-content max-content;
  grid-gap: 30px;
  margin-left: 16px;
  margin-bottom: 16px;
}
.dtc-version-num {
  display:grid;
  grid-template-columns: 40px 1fr 40px;
  text-align: center;
}

.first-row {
  position: relative;
  .positive-btn {
    position:absolute;
    left: 160px;
    top: 5px;
  }

}
.btn-right {
  position: relative;
}
.detail-btn{
  position:absolute !important;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
  z-index:2;

}
.vue-js-switch {
background: transparent !important;
}
.footer-b4-save {
  margin: 1.5rem ;
  display:grid;
  grid-template-columns:  1fr 200px 100px 100px;
  grid-gap: 1rem;
}

.report-tab {
  position:absolute;
  top:3px;
  left:10px;
  right:0px;
  bottom:0;
  height:calc(100% + 30px);
  width:100%;
  background:white;
  z-index:99999;
}
.title_center {
  color: black !important;
}
.themeBlack .title_center {
  color: white !important;
}
.dtc-vue-tab {
  background: white;
  overflow-x: hidden;
}
.themeBlack .dtc-vue-tab {
  background: black !important;
}
// *::-webkit-scrollbar {
// 		width: 0px;  /* Remove scrollbar space */
// 		background: transparent;  /* Optional: just make scrollbar invisible */
// }
.tab-close{
   position:absolute;
   top: -4px;
   right:0px;
   cursor: pointer;
}
.tab-close:hover{
  transform: rotate(7deg);
}

.active-history {
  background: yellow;
}

.themeBlack .active-history {
  background:  var(--red) !important;
  font-weight: 700;
}

</style>
