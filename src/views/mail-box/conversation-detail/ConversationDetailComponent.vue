<template>
  <div class="flex items-center p-3">
    <div class="grow flex items-center pr-5">
      <button class="btn btn-secondary" @click="backConversation">
        <ArrowLeftIcon class="w-4 h-4"/>
      </button>
      <Tippy tag="button" :content="locale['archive']" class="btn btn-secondary ml-3 md:ml-1.5"
             @click="conversationDetail.mbArchiveModalShowHide = true">
        <ArchiveIcon class="w-4 h-4"/>
      </Tippy>
      <Tippy tag="button" :content="locale.filter" class="btn btn-secondary hidden md:inline-block ml-3 md:ml-1.5"
             @click="actionFilterSelected(conversationDetail.itemList)">
        <FilterIcon class="w-4 h-4"/>
      </Tippy>
      <!-- BEGIN: Đánh dấu thư rác  -->
      <Tippy tag="button" :content="locale['spam']" class="btn btn-secondary ml-3 md:ml-1.5"
             v-if="String(folderPath).toLowerCase() !== 'junk'"
             @click="actionSpamConversation(conversationDetail.conversationId, true)"
      >
        <AlertOctagonIcon class="w-4 h-4"/>
      </Tippy>
      <!-- END: Đánh dấu thư rác  -->
      <!-- BEGIN: Đánh dấu không phải thư rác  -->
      <Tippy tag="button" :content="locale.reportConversationNoSpam" class="btn btn-secondary ml-3 md:ml-1.5"
             @click="actionSpamConversation(conversationDetail.conversationId, false)" v-else>
        <ShareIcon class="w-4 h-4" />
      </Tippy>
      <!-- END: Đánh dấu không phải thư rác  -->
      <!-- BEGIN: Xoá vào thùng rác  -->
      <Tippy tag="button" :content="locale['delete']" class="btn btn-secondary ml-3 md:ml-1.5"
             v-if="String(folderPath).toLowerCase() !== 'trash' && String(folderPath).toLowerCase() !== 'junk'"
             @click="actionDeleteConversation(conversationDetail, false)">
        <TrashIcon class="w-4 h-4"/>
      </Tippy>
      <!-- END: Xoá vào thùng rác  -->
      <!-- BEGIN: Xoá vào vĩnh viễn  -->
      <Tippy tag="button" :content="locale.deletePermanentlyConversation"
             class="btn btn-secondary ml-3 md:ml-1.5" type="button"
             @click="actionDeleteConversation(conversationDetail, true)" v-else>
        <DeleteIcon class="w-4 h-4"/>
      </Tippy>
      <!-- END: Xoá vào vĩnh viễn  -->
      <Tippy tag="button" :content="locale.print" class="btn btn-secondary hidden md:inline-block ml-3 md:ml-1.5"
             @click="actionPrintConversation(conversationDetail.conversationId)">
        <PrinterIcon class="w-4 h-4"/>
      </Tippy>
      <Dropdown class="inline-block ml-3 md:ml-1.5" v-slot="{dismiss}">
        <DropdownToggle class="btn btn-secondary">
          <MoreVerticalIcon class="w-4 h-4"/>
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent>
            <DropdownItem
                @click="actionReadOrUnReadConversation('!read', conversationDetail.conversationId); dismiss()">
              <MailIcon class="w-4 h-4 mr-2"/>
              {{ locale['markUnread'] }}
            </DropdownItem>
            <DropdownItem class="md:hidden" @click="actionFilterSelected(conversationDetail.itemList); dismiss()">
              <FilterIcon class="w-4 h-4 mr-2"/> {{locale.filter}}
            </DropdownItem>
            <DropdownItem class="md:hidden" @click="actionPrintConversation(conversationDetail.conversationId); dismiss()">
              <PrinterIcon class="w-4 h-4 mr-2"/> {{locale.print}}
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="shrink-0 flex">
      <span class="my-auto mr-5 dark:text-slate-300">
        {{ locationConversationDetail + 1 }}
        <span class="md:hidden">/</span>
        <span class="hidden md:inline-block">{{ locale.inTotalNumber }}</span>
        {{ numberPage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}
      </span>
      <Tippy tag="button" :content="locale['newder']" class="btn btn-secondary mr-2"
        @click="changeConversationDetails(-1)" >
        <ChevronLeftIcon class="w-4 h-4"/>
      </Tippy>
      <Tippy tag="button" :content="locale['older']" class="btn btn-secondary"
         @click="changeConversationDetails(1)"
      >
        <ChevronRightIcon class="w-4 h-4"/>
      </Tippy>
    </div>
  </div>
  <!-- BEGIN: Lưu trữ -->
  <mail-box-archive-modal :conversation-selected="conversationDetail" :is-conversation-detail="true" ></mail-box-archive-modal>
  <!-- END: Lưu trữ -->
  <div class="z-[99] bg-white inbox-conversation-detail">
    <div class="accordion-group overflow-y-auto overflow-x-hidden dark:scroll-dark" ref="mailWrap">
      <div class="flex md:pr-0 md:pl-14 py-3" v-if="conversationDetail.itemList.length > 0">
        <h2 class="font-medium text-gray-700 px-3 text-2xl">
          {{ conversationDetail.itemList[0].subject }}
        </h2>
        <div class="email-flag pr-3 pt-2">
          <Tippy tag="button" :class="conversationDetail.itemList[0].flag ? 'flag-active' : ''"
                 :content="conversationDetail.itemList[0].flag ? locale.markUnFlagConversationSelected : locale.markFlagConversationSelected"
                 @click="actionChangeFlag(conversationDetail.itemList[0])">
            <FlagIcon class="w-4 h-4"></FlagIcon>
          </Tippy>
        </div>
      </div>
      <div class="accordion-item md:p-3 border-b border-gray-200 dark:border-gray-200"
           v-for="(item, index) in conversationDetail.itemList" :key="item.messageDate">
        <div class="relative">
          <div class="flex items-start">
            <div class="grow">
              <div class="flex items-start">
                <div class="shrink-0 bg-slate-300 rounded-full w-12 h-12 p-2 flex items-center justify-center">
                  <UserIcon class="w-6 h-6 text-gray-500"/>
                </div>
                <div class="grow pl-2">
                  <button class="text-black text-left"
                  >
                    <small class="text-gray-600 mr-2">{{ locale['from'] }}:</small>
                    <span class="mr-1" v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 'f')">
                      {{ email.partName ? email.partName : email.name }}{{ handleEmailAddress(item.emailAddress, eIdx, 'f') }}
                    </span>
                    <!--  <span class="text-xs text-gray-600">{{ '<' + email.address + '>' }}</span>-->
                  </button>
                  <div class="flex relative items-center pt-1"
                       v-if="item.emailAddress.findIndex((data) => data.type === 't') >= 0"
                  >
                    <button class="text-black text-left">
                      <small class="text-gray-600 mr-2">{{ locale['to'] }}:</small>
                      <div class="inline-block" v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 't')">
                        {{ email.partName ? email.partName : email.name }}{{ handleEmailAddress(item.emailAddress, eIdx, 't') }}
                      </div>
                      <span v-if="item.emailAddress.findIndex((data) => data.type === 'c') >= 0">, </span>
                      <div class="inline-block mr-1" v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 'c')">
                        {{ email.partName ? email.partName : email.name }}{{ handleEmailAddress(item.emailAddress, eIdx, 'c') }}
                      </div>
                    </button>
                    <button class="btn p-0 ml-1 relative z-[52]" :name="'mail-info-' + item.messageId"
                            @click.capture="item.tippyShow = !item.tippyShow">
                      <ChevronDownIcon class="w-3 h-3"/>
                    </button>
                    <!--  BEGIN: Email To info-->
                    <div v-if="item.tippyShow">
                      <TippyContent :to="'mail-info-' + item.messageId" :options="{interactive : true}">
                        <div class="p-2">
                          <ul>
                            <li class="flex items-start py-1">
                              <div class="shrink-0 min-w-[50px] text-right text-xs">
                                {{ locale['from'] }}:
                              </div>
                              <div class="grow pl-3">
                                <div class="inline-block mr-1"
                                     v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 'f')">
                                  <b>{{ email.partName ? email.partName : email.name }}</b>
                                  <span class="text-xs ml-1">{{ '<' + email.address + '>' }}{{ handleEmailAddress(item.emailAddress, eIdx, 'f') }}</span>
                                </div>
                              </div>
                            </li>
                            <li class="flex items-start py-1">
                              <div class="shrink-0 min-w-[50px] text-right text-xs">
                                {{ locale['to'] }}:
                              </div>
                              <div class="grow pl-3">
                                <div class="inline-block mr-1"
                                     v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 't')">
                                  <span>{{ email.address }}{{ handleEmailAddress(item.emailAddress, eIdx, 't') }}</span>
                                </div>
                              </div>
                            </li>
                            <li class="flex items-start py-1"
                                v-if="item.emailAddress.findIndex((data) => data.type === 'c') >= 0">
                              <div class="shrink-0 min-w-[50px] text-right text-xs">
                                {{ locale['cc'] }}:
                              </div>
                              <div class="grow pl-3">
                                <div class="inline-block mr-1"
                                     v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 'c')">
                                  <span>{{ email.address }}{{ handleEmailAddress(item.emailAddress, eIdx, 'c') }}</span>
                                </div>
                              </div>
                            </li>
                            <li class="flex items-start py-1"
                                v-if="item.emailAddress.findIndex((data) => data.type === 'b') >= 0">
                              <div class="shrink-0 min-w-[50px] text-right text-xs">
                                {{ locale['bcc'] }}:
                              </div>
                              <div class="grow pl-3">
                                <div class="inline-block mr-1"
                                     v-for="(email, eIdx) in item.emailAddress.filter((data) => data.type === 'b')">
                                  <span>{{ email.address }}{{ handleEmailAddress(item.emailAddress, eIdx, 'b') }}</span>
                                </div>
                              </div>
                            </li>
                            <li class="flex items-start py-1">
                              <div class="shrink-0 min-w-[50px] text-right text-xs">
                                {{ locale.date }}:
                              </div>
                              <div class="grow pl-3">
                                {{ helper.formatDate(item.messageDate, env.dateTimeFormat) }}
                              </div>
                            </li>
                            <li class="flex items-start py-1">
                              <div class="shrink-0 min-w-[50px] text-right text-xs">
                                {{ locale.subject }}:
                              </div>
                              <div class="grow pl-3">
                                {{ item.subject }}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </TippyContent>
                    </div>
                    <!--  END: Email To info-->
                  </div>
                  <div class="flex items-center" v-if="item.tagList.length > 0">
                    <small class="text-gray-600 mr-2">{{ locale.tags }}:</small>
                    <div class="grow -mx-1">
                      <div class="inline-flex rounded bg-gray-200 m-1 z-[52] relative" v-for="tag in item.tagList" :key="tag.id">
                        <button class="py-0.5 px-2 text-xs hover:bg-gray-300 rounded-l" :id="tag.id"
                                @click="actionShowConversationByTag(tag)">{{ tag.name }}</button>
                        <button type="button" class="btn-close p-1 hover:bg-gray-300 rounded-r"
                                @click="actionDeleteTag(item, tag)">
                          <XIcon class="w-3 h-3"/>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center" v-if="item.autoSendTime > 0">
                    <small class="text-gray-600 mr-2">{{ locale.scheduledSendIn }}:</small>
                    <div class="grow -mx-1">
                      {{ dayjs(new Date(item.autoSendTime)).format(env.dateTimeFormat) }}
                    </div>
                  </div>
                  <div class="text-xs text-gray-700 word-break" v-if="!item.expandedContent">
                    {{ item.contentSort }}
                  </div>
                </div>
              </div>
            </div>
            <div class="shrink-0">
              <div class="flex flex-col-reverse md:flex-row pl-3 items-end">
                <div class="my-2 text-slate-600 text-xs" :class="{'mr-2': item.accodionHide}">
                  <span class="hidden md:inline-block">{{ helper.formatDate(item.messageDate, env.dateTimeFormat) }}</span>
                  <span class="md:hidden">{{helper.formatDate(item.messageDate, env.dateFormat)}}</span>
                  ({{ timeAgo(item.messageDate) }})
                </div>
                <div class="pl-3 relative z-[52]" v-if="item.accodionHide || item.newConversation">
                  <!-- BEGIN: TAG ITEM LIST -->
                  <mail-box-tag class-name="inline-block mr-2" :message-id="item.messageId" :conversation-id="item.conversationId"
                                :tag-list-of-conversation-detail="item.tagList"/>
                  <!-- END: TAG ITEM LIST -->
                  <Tippy tag="button" class="btn btn-secondary btn-sm mr-2 hidden md:inline-block" :content="locale.showOriginalConversationDetail"
                         @click="actionShowOriginalConversation(item); repliedScrollTo(index)">
                    <CodeIcon class="w-4 h-4"/>
                  </Tippy>
                  <Tippy tag="button" :content="locale['modify']" class="btn btn-sm btn-secondary mr-2 hidden md:inline-block" v-if="hasDisabledReplyAndForward"
                         @click="actionModifyConversation(item); repliedScrollTo(index)">
                    <EditIcon class="w-4 h-4"></EditIcon>
                  </Tippy>
                  <Tippy tag="button" :content="locale['reply']" class="btn btn-sm btn-secondary mr-2 hidden md:inline-block" :disabled="hasDisabledReplyAndForward"
                         @click="actionReplyConversation(item); repliedScrollTo(index)">
                    <ReplyIcon class="w-4 h-4"></ReplyIcon>
                  </Tippy>
                  <Tippy tag="button" class="btn btn-secondary btn-sm mr-2 hidden md:inline-block" :content="locale['replyToAll']" :disabled="hasDisabledReplyAndForward"
                         @click="actionReplyAllConversation(item); repliedScrollTo(index)">
                    <ReplyAllIcon class="w-4 h-4"/>
                  </Tippy>
                  <Tippy tag="button" class="btn btn-secondary btn-sm hidden md:inline-block" :content="locale['forward']" :disabled="hasDisabledReplyAndForward"
                         @click="actionForwardConversation(item); repliedScrollTo(index)">
                    <ForwardIcon class="w-4 h-4"/>
                  </Tippy>
                  <Dropdown class="inline-block md:hidden" v-slot="{dismiss}">
                    <DropdownToggle class="btn btn-secondary btn-sm">
                      <MoreVerticalIcon class="w-4 h-4"/>
                    </DropdownToggle>
                    <DropdownMenu class="w-56">
                      <DropdownContent>
                        <DropdownItem v-if="hasDisabledReplyAndForward" @click="actionModifyConversation(item); repliedScrollTo(index); dismiss()">
                          {{locale['modify']}}
                        </DropdownItem>
                        <DropdownItem :disabled="hasDisabledReplyAndForward" @click="actionReplyConversation(item); repliedScrollTo(index); dismiss()">
                          <ReplyIcon class="w-4 h-4 mr-2"/> {{locale['reply']}}
                        </DropdownItem>
                        <DropdownItem :disabled="hasDisabledReplyAndForward" @click="actionReplyAllConversation(item); repliedScrollTo(index); dismiss()">
                          <ReplyAllIcon class="w-4 h-4 mr-2"/> {{locale['replyToAll']}}
                        </DropdownItem>
                        <DropdownItem :disabled="hasDisabledReplyAndForward" @click="actionForwardConversation(item); repliedScrollTo(index); dismiss()">
                          <ForwardIcon class="w-4 h-4 mr-2"/> {{locale['forward']}}
                        </DropdownItem>
                        <DropdownItem
                            @click="actionShowOriginalConversation(item); repliedScrollTo(index); dismiss()">
                          <CodeIcon class="w-4 h-4 mr-2"/> {{locale.showOriginalConversationDetail}}
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute inset-0 cursor-pointer"
               :class="{'-z-[10]': item.newConversation, 'z-[51]': !item.newConversation}"
               @click="ToggleEmail($event, item)"></div>
        </div>
        <div class="leading-relaxed" v-show="item.accodionHide || item.newConversation">
          <!-- BEGIN: CONTENT -->
          <div class="bg-white py-3 md:pr-3 md:pl-[57px] overflow-auto scroll-gray-400">
            <!--        BEGIN: Xử lý cảnh báo -->
            <div class="alert-wrap mb-2" v-if="item.imageMailAlert">
              <Alert class="alert-outline-pending inline-flex w-full overflow-y-hidden overflow-x-auto">
                <ImageIcon class="w-6 h-6 shrink-0 mr-2"/>
                <div class="grow flex whitespace-nowrap">
                  <div>
                    {{locale.picturesAreNotDisplayed}}
                    <a class="text-blue-600 hover:underline" href="javascript:" @click="actionTrustImage(item, '', '')">
                      {{locale.showThePictureImage}}
                    </a>
                  </div>
                  <span class="mx-1">-</span>
                  <div class="flex">
                    {{locale.alwaysShowPhotosSentFrom}}
                    <a href="javascript:"
                       class="text-blue-600 hover:underline ml-1" @click="actionTrustImage(item, '', item.trustImageEmail)">{{ item.trustImageEmail }}</a>
                  </div>
                </div>
                <!--              <button type="button" class="btn-close" aria-label="Close" @click="dismiss">
                                <XIcon class="w-4 h-4"/>
                              </button>-->
              </Alert>
            </div>
            <!-- END: Xử lý cảnh báo -->
            <div class="mail-content" :class="{'whitespace-pre-line break-words': !item.hasHtml}"
                  v-html="item.content ? rewriteMailWithLink(item, item.content) : rewriteMailWithLink(item, item.contentSort)"
                 :ref="(el) => item.elementContent = el"></div>
            <!-- BEGIN: ATTACHMENT -->
            <div v-if="item.attachments.length > 0"
                 class="grid grid-cols-12 gap-4 pt-3 mt-3 border-t border-dashed"
                 style="border-color: #e2e2e2;">
              <div class="flex items-center col-span-12">
                <div class="grow text-gray-700">
                  {{ item.attachments.length }} {{ locale.attachment }}
                </div>
                <div class="shrink-0">
                  <div class="flex items-center" v-if="item.attachments.length > 1">
                    <Tippy tag="a"
                           class="btn btn-secondary mr-2"
                           @click="actionDownloadFileAttachment(item, item.attachments[0], item.attachments)" :content="locale['downloadAllAttachment']"
                    >
                      <DownloadCloudIcon class="w-4 h-4"/>
                    </Tippy>
                    <Tippy tag="button"
                           class="btn btn-secondary"
                           @click="modalContentRemoveAttachment = true; itemConversationDetailSelected = item;"
                           :content="locale['removeAllAttachment']">
                      <TrashIcon class="w-4 h-4"/>
                    </Tippy>
                  </div>
                </div>
              </div>
              <div v-for="attachment in item.attachments"
                   :key="attachment"
                   class="col-span-6 sm:col-span-4 md:col-span-3 2xl:col-span-2"
              >
                <div class="file rounded-md p-3 relative border border-slate-200 hover:border-slate-300 dark:border-slate-200 dark:hover:border-slate-300">
                  <button
                      @click="actionDownloadFileAttachment(item, attachment)"
                      class="w-2/6 file__icon file__icon--file mx-auto"
                  >
                    <div class="file__icon__file-name"></div>
                  </button>
                  <Tippy
                      tag="a"
                      @click="actionDownloadFileAttachment(item, attachment)"
                      class="tooltip block truncate text-center font-medium mt-4 text-slate-400"
                      :content="attachment.fileName"
                  >
                    {{ attachment.fileName }}
                  </Tippy>
                  <div class="text-slate-500 text-xs text-center mt-0.5">
                    {{ prettyBytes(attachment.size) }}
                  </div>
                  <Dropdown class="absolute top-0 right-0 mr-2 mt-3 ml-auto" v-slot="{ dismiss }">
                    <DropdownToggle tag="a" class="w-5 h-5 block">
                      <MoreVerticalIcon class="w-5 h-5 text-slate-500"/>
                    </DropdownToggle>
                    <DropdownMenu class="w-40">
                      <DropdownContent>
                        <DropdownItem
                            @click="actionDownloadFileAttachment(item, attachment)">
                          <DownloadCloudIcon class="w-4 h-4 mr-2"/>
                          {{ locale.download }}
                        </DropdownItem>
                        <DropdownItem @click="formDataDeleteAttachment.actionShowModalDelete(item, attachment, dismiss)">
                          <TrashIcon class="w-4 h-4 mr-2"/>
                          {{ locale.delete }}
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <!-- END: ATTACHMENT -->
            <!--  BEGIN: REPLY-->
            <div class="mt-6" ref="repliesItem" v-show="item.composeMessageDto && item.composeMessageDto.showHide">
              <mail-new :mailData="item.composeMessageDto" :message="item"
                        @reloadConversationDetail="findConversationDetail(conversationDetail.conversationId)"
                        @closeMailNew="actionDeleteMessageDraft(item.composeMessageDto.id)"></mail-new>
            </div>
            <!--  END: REPLY-->
            <div class="mt-5 reply-bottom-group" v-if="!item.composeMessageDto">
              <button class="btn py-1 px-3 rounded-full text-slate-600 hover:bg-slate-100 dark:border-slate-300 btn-sm"
                      @click="actionReplyConversation(item);repliedScrollTo(index)">
                <ReplyIcon class="w-5 h-5 mr-1 mb-1"></ReplyIcon>
                {{locale.reply}}
              </button>
              <button class="btn py-1 px-3 ml-2 rounded-full text-slate-600 hover:bg-slate-100 dark:border-slate-300 btn-sm"
                      @click="actionForwardConversation(item);repliedScrollTo(index)">
                <ForwardIcon class="w-5 h-5 mr-1 mb-1"></ForwardIcon>
                {{locale.forward}}
              </button>
            </div>
          </div>
          <!-- END: CONTENT -->
        </div>
<!--        TODO: Tạm ẩn vì không áp dung theo UX của gmail-->
<!--        <div v-if="!showButtonReply && index === conversationDetail.itemList.length - 1 " class="my-5 md:pl-[57px]">
          <button class="btn py-1 px-3 rounded-full text-slate-600 hover:bg-slate-100 dark:border-slate-300"
                  @click="actionReplyConversation(item);repliedScrollTo(index)">
            <ReplyIcon class="w-5 h-5 mr-1 mb-1"></ReplyIcon>
            {{locale.reply}}
          </button>
          <button class="btn py-1 px-3 ml-2 rounded-full text-slate-600 hover:bg-slate-100 dark:border-slate-300"
                  @click="actionForwardConversation(item);repliedScrollTo(index)">
            <ForwardIcon class="w-5 h-5 mr-1 mb-1"></ForwardIcon>
            {{locale.forward}}
          </button>
        </div>-->
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content alert remove attachment -->
  <Modal :show="modalContentRemoveAttachment" @hidden="modalContentRemoveAttachment = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3"/>
        <div class="text-3xl mt-5">{{ locale.areYouSure + locale.delete + ' ' + locale.attachment }}?</div>
        <div class="text-slate-500 mt-2">
          {{locale.youWantToDeleteThisRecord}} <br/>{{locale.thisProcessCannotBeUndone}}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
            type="button"
            @click="modalContentRemoveAttachment = false"
            class="btn btn-outline-secondary w-24 mr-1"
        >
          {{ locale.cancel }}
        </button>
        <button type="button" class="btn btn-danger w-24" @click="actionRemoveAllAttachment">
          {{ locale.delete }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content alert remove attachment -->
  <!-- BEGIN: Modal Content show original conversation detail -->
  <Modal :show="showModalOriginalConversationDetail" size="modal-xl" @hidden="showModalOriginalConversationDetail = false">
    <ModalHeader>
      <h2 class="text-xl">{{ locale.showOriginalConversationDetail }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="text-slate-500 mt-2 overflow-y-auto overflow-x-hidden" style="max-height: calc(100vh - 260px);">
        <pre class="whitespace-pre-line"><code>{{ contentOriginalConversationDetail}}</code></pre>
      </div>
    </ModalBody>
    <ModalFooter>
      <button
          type="button"
          @click="showModalOriginalConversationDetail = false"
          class="btn btn-secondary w-24 mr-1"
      >
        {{ locale.cancel }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content show original conversation detail -->
  <!-- BEGIN: Modal Xoá File -->
  <Modal backdrop="static" :show="formDataDeleteAttachment.showModal" @hidden="formDataDeleteAttachment.showModal = false">
    <ModalBody>
      <div class="text-center">
        <div class="mb-5">
          <p class="text-2xl">{{ locale.areYouSure }} {{ locale.delete.toLowerCase() }} {{ formDataDeleteAttachment.modalTitle }}?</p>
        </div>
        <div class="-mx-2">
          <button type="button" @click="formDataDeleteAttachment.showModal = false" class="btn btn-secondary w-24 m-2">
            {{ locale['cancel'] }}
          </button>
          <button type="button" @click="actionRemoveOneAttachment(formDataDeleteAttachment.item, formDataDeleteAttachment.attachment,
                  formDataDeleteAttachment.dismiss)" class="btn btn-danger w-24 m-2">
            {{ locale['delete'] }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Xoá File -->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, reactive, ref} from 'vue';
import {MyStore} from '@/stores/my-store';
import {helper} from '@/utils/helper';
import {env} from '@/utils/MyVariables';
import {Attachment, ConversationDetail, ItemConversationDetail, ItemTag,} from '@/model/ConversationDetail';
import {ResponseData} from '@/model/ResponseData';
import {
  actionConversation,
  actionConversationDetail,
  showToastMessage,
  timeAgo,
  tryParseJSONObject
} from '@/utils/MyFunction';
import ConversationDetailService from '@/service/ConversationDetailService';
import {useRoute} from 'vue-router';
import {EmailAddress, MessageDetail} from '@/model/MessageDetail';
import {RequestNoResponse} from '@/model/RequestNoResponse';
import {createIcons, icons} from "lucide";
import MailBoxArchiveModal from "@/views/mail-box/partial/MailBoxArchiveModal.vue";
import {ComposeMessageDto} from "@/model/dto/ComposeMessageDto";
import RequestMessageService from '@/service/RequestMessageService';
import {FileAttachment} from "@/model/FileAttachment";
import MailBoxTag from "@/views/mail-box/partial/MailBoxTag.vue";
import dayjs from "dayjs";
import {RequestMessage} from '@/model/RequestMessage';
import { prettyBytes } from '@/utils/pretty-bytes-function/PrettyBytes';
import { Item } from '@/model/Conversation';
import {ConversationStore} from "@/stores/conversation-store/conversation-store";
import mailOpen from "@/assets/images/mail-open.svg";
import FileAttachmentService from '@/service/FileAttachmentService';
import { saveAs } from 'file-saver';
import SeoTitleTabBrowser from "@/global-components/inet-custom/components/SeoTitleTabBrowser.vue";
import {SearchConvRequest} from "@/model/SearchConvRequest";
import {Tag} from "@/model/Tag";
import {MyTagStore} from "@/stores/tag-store/tag-store";
import {FolderStore} from "@/stores/folder-store/folder-store";
import MailNew from "@/views/mail-box/MailNew.vue";
import t from "typy";
import {SeoTitleStore} from "@/stores/seo-title-store/seo-title-store";

export default defineComponent({
  name: 'ConversationDetailComponent',
  mounted() {
    createIcons({icons});
  },
  components: {MailNew, SeoTitleTabBrowser, MailBoxTag, MailBoxArchiveModal},
  methods: {
    repliedScrollTo(_idx) {
      const elm = this.$refs.repliesItem as any;
      if (elm[_idx]) {
        setTimeout(() => {
          elm[_idx].scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }, 0);
      }
    },
  },
  props: {
    conversationDetail: { type: Object as PropType<ConversationDetail> },
    numberPage: { type: Number, default: 0 },
    sortBy: { type: String, default: 'dateDesc' }
  },
  setup(props) {
    //init value
    const myStore = MyStore();
    const route = useRoute();
    const conversationStore = ConversationStore();
    const myTagStore = MyTagStore();
    const seoTitleStore = SeoTitleStore();
    const emitter = myStore.useEmitter();
    const zimbraHostInfo = myStore.myCompany.zimbraHostInfo;
    const myUser = computed(() => myStore.myUser);
    const locale = computed(() => myStore.locale);
    const folderPath = computed(() => route.params.itemId);
    const conversationDetail = computed(() => props.conversationDetail as ConversationDetail);
    const numberPage = ref(props.numberPage);
    const locationConversationDetail = ref(conversationStore.conversation.itemList.findIndex(c => c.conversationId === conversationDetail.value.conversationId));
    const conversationIdSelected = ref(conversationDetail.value.conversationId);
    const eAdd = ref<EmailAddress[]>([]);
    const messageDetail = ref<MessageDetail>(new MessageDetail());
    const itemConversationDetailSelected = ref<ItemConversationDetail>(new ItemConversationDetail());
    const modalContentRemoveAttachment = ref(false);
    const expandedItemConversation = ref(false);
    const mailWrap = ref();
    const isReply = ref(false);
    const isModify = ref(false);
    const hasDisabledReplyAndForward = ref(false);
    const contentOriginalConversationDetail = ref('');
    const showModalOriginalConversationDetail = ref(false);
    const conversation = computed(() => conversationStore.conversation);
    const showButtonReply = ref(false);
    const folderStore = FolderStore();
    const tagSelected = computed({
      get: () => myTagStore.tagSelected as Tag,
      set: (data) => myTagStore.tagSelected = data,
    });
    const formDataDeleteAttachment = reactive({
      showModal: false,
      modalTitle: '',
      item: new ItemConversationDetail,
      attachment: new Attachment,
      dismiss: '' as any,
      actionShowModalDelete: (item: ItemConversationDetail, attachment: Attachment, dismiss: any) => {
        formDataDeleteAttachment.showModal = true;
        formDataDeleteAttachment.modalTitle = attachment.fileName;
        formDataDeleteAttachment.item = item;
        formDataDeleteAttachment.attachment = attachment;
        formDataDeleteAttachment.dismiss = dismiss;
      }
    })

    // Begin HungHv: Phát hiện tin nhắn có link nếu có thì thêm thẻ <a>
    function rewriteMailWithLink(mail, mailContent) {
      if(!mailContent) return;
      //  Trường hợp Mail HTML
      if (mail.hasHtml) {
        // Với các mail HTML thì trước tiên thay thế thẻ <a> có sẵn bằng thẻ <a> có CSS
        const newMail = mailContent.replaceAll('<a ', '<a class="text-[#0c77df] hover:underline"')

        // Sau đó tìm kiếm các link mà các link đó ko được trùng với các thẻ <a> có sẵn
        // Các link thay thế hợp lệ là \s: có dấu cách đằng trước hoặc ?<=<p> là có thẻ <p> đứng trước
        // Ví dụ <p> http://youtube.com <p>
        const urlRegexHTML =  /((?<=\s)|(?<=<p>))((https?:\/\/)|(www\.)|(http?:\/\/)).+?((?=<)|(?=\s))/g

        return newMail.replace(urlRegexHTML, function (url) {
          let hyperlinkHTML = url;
          if (!hyperlinkHTML.match('^https?:\/\/')) {
            hyperlinkHTML = 'http://' + hyperlinkHTML;
          }
          return '<a class= "text-[#0c77df] hover:underline" href="' + hyperlinkHTML + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
        });
        //  Trường họp là Mail Text
      } else {
        // Với Mail Text chỉ cần phát hiện link và thay thế bằng thẻ <a>
        const urlRegexText = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return  mailContent.replace(urlRegexText, function (url) {
          let hyperlinkText = url;
          if (!hyperlinkText.match('^https?:\/\/')) {
            hyperlinkText = 'http://' + hyperlinkText;
          }
          return '<a class= "text-[#0c77df] hover:underline" href="' + hyperlinkText + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
        });
      }
    }
    // End HungHv: Phát hiện tin nhắn có link nếu có thì thêm thẻ <a>

    function backConversation() {
      if (!myStore.alertReplyMail.replyMail) {
        emitter.emit('show-conversation');
      } else {
        myStore.alertReplyMail.showAlert = true;
        myStore.alertReplyMail.router = route.fullPath;
      }
    }

    function tranferDataToMailNew(item: RequestMessage) {
      emitter.emit('reply-in-conversation-detail' + item.origid, { requestMessage: item, isReply: isReply.value, isModify: isModify.value });
    }

    const conversationOpenStatus: any = ref([]);
    function ToggleEmail(_evt, _item) {
      _evt.preventDefault();
      _item.accodionHide = !_item.accodionHide;
      let conversation = conversationOpenStatus.value.find(c => c.messageId === _item.messageId);
      if (conversation) {
        conversation.open = _item.accodionHide;
      } else {
        conversationOpenStatus.value.push({ messageId: _item.messageId, open: _item.accodionHide });
      }
      setTimeout(() => {
        mailWrapScrollTo((_evt.target.parentElement.offsetTop - 10));
      }, 300);
    }

    function mailWrapScrollTo(_elmOffsetTop) {
      if (typeof _elmOffsetTop != 'number') return;
      const elParent = mailWrap.value as HTMLElement;
      // elParent.scrollTo({top: _elmOffsetTop, behavior: 'smooth'});
      elParent.scrollTop = _elmOffsetTop;
    }

    function onChange(index) {
      //Dựa vào số index đã chọn, tìm trong danh sách item conversation
      conversationDetail.value.itemList.forEach((value, idx) => {
        value.expandedContent = idx === index;
      });
    }

    async function actionShowConversationByTag(tag: ItemTag) {
      //set to tag selected
      tagSelected.value = new Tag();
      tagSelected.value.id = tag.id;
      tagSelected.value.name = tag.name;
      // Reload lai conversation
      emitter.emit('show-conversation')
    }

    async function actionChangeFlag(item: ItemConversationDetail) {
      //change value
      item.flag = !item.flag;
      //call action
      const main = await actionConversation(item.conversationId, item.flag ? 'flag' : '!flag');
      if (main) {
        await conversationStore.handleFlagConversation(item);
      }
    }

    async function actionDeleteTag(item: ItemConversationDetail, tag: ItemTag) {
      //remove from list
      const findIndex = item.tagList.findIndex(value => value.id === tag.id);
      if (findIndex >= 0) {
        item.tagList.splice(findIndex, 1);
        //call action
        let main = await actionConversationDetail(item.messageId, '!tag', tag, true);
        if (main) {
          // xử lý tag trong conversation store
          for (const value of conversationDetail.value.itemList) {
            if (value.messageId === item.messageId) {
              value.tagList = value.tagList.filter(t => t.id !== tag.id);
            }
          }
        }
      }
    }

    async function actionRemoveOneAttachment(item: ItemConversationDetail, attachment: Attachment, dismiss: any) {
      //close dropdown
      dismiss();
      // close dropdown
      formDataDeleteAttachment.showModal = false;
      //init request
      const itemFind = new RequestNoResponse();
      itemFind.messageId = item.messageId;
      itemFind.part = attachment.part;
      //call request
      const response = await RequestMessageService.removeAttachment(itemFind, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          // Xoá file trong attachments
          for (const item of conversationDetail.value.itemList) {
            if (item.messageId === itemFind.messageId) {
              item.attachments = item.attachments.filter((a) => a.part !== itemFind.part);
            }
          }
          // Set lai conversation id trong store
          conversation.value.itemList.map((c) => {
            if (c.conversationId === item.conversationId) {
              c.conversationId = responseData.values.Body.RemoveAttachmentsResponse.m[0].cid;
            }
          })
          // set lai message id trong conversationOpen
          conversationOpenStatus.value.map((c) => {
            if (c.messageId === item.messageId) {
              c.messageId = responseData.values.Body.RemoveAttachmentsResponse.m[0].id;
            }
          });
          // find conversation id va reset
          await findConversationDetail(responseData.values.Body.RemoveAttachmentsResponse.m[0].cid);
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    async function actionRemoveAllAttachment() {
      //init request
      const itemFind = new RequestNoResponse();
      itemFind.messageId = itemConversationDetailSelected.value.messageId;
      itemFind.part = itemConversationDetailSelected.value.attachments.map((value) => value.part).join(',');
      //call request
      const response = await RequestMessageService.removeAttachment(itemFind, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          //đóng modal
          modalContentRemoveAttachment.value = false;
          itemConversationDetailSelected.value.attachments.splice(0);
          //reload
          // await initGetConversationDetail();
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    function actionInitReplyOrForwardConversation(item: ItemConversationDetail, type: string) {
      isReply.value = true; isModify.value = false;
      //init value compose
      item.composeMessageDto = new ComposeMessageDto();
      item.composeMessageDto.id = Math.random().toString(36).substring(2, 9);
      //init value request message
      item.requestMessage = new RequestMessage();
      //init id
      item.requestMessage.origid = item.messageId;
      //init type reply or forward
      item.requestMessage.rt = type;
      //init id header
      item.requestMessage.irt._content = item.messageIdHeader;
      //init subject
      item.requestMessage.su._content = item.subject;
      //init content
      item.requestMessage.clientContent = '<blockquote>' + item.content + '</blockquote>';
      //active show reply editor
      item.composeMessageDto.showHide = true;
      // active replyMail
      myStore.alertReplyMail.replyMail = true;
    }

    function actionModifyConversation(item: ItemConversationDetail){
      isReply.value = false; isModify.value = true;
      //init value compose
      item.composeMessageDto = new ComposeMessageDto();
      item.composeMessageDto.id = Math.random().toString(36).substring(2, 9);
      //init value request message
      item.requestMessage = new RequestMessage();
      //init value id
      item.requestMessage.id = item.messageId;
      //init subject
      item.requestMessage.su._content = item.subject;
      //init content
      item.requestMessage.clientContent = item.content;
      //init from, to, cc ,bcc
      setEmailToRequestMessage(item);
      //init attachment
      setAttachmentToRequestMessage(item);
      //call emit
      tranferDataToMailNew(item.requestMessage);
    }

    function setEmailToRequestMessage(item: ItemConversationDetail){
      //init email to
      if (item.emailAddress.length > 0) {
        //email to (check reply or modify)
        let emailToFilter = [] as EmailAddress[];
        if(isReply.value) {
          emailToFilter = item.emailAddress.filter(value => value.address !== myUser.value.account && (value.type === 'f' || value.type === 't'));
          if (emailToFilter.length <= 0) {
            const emailAccount = item.emailAddress.find(value => value.address === myUser.value.account);
            if (emailAccount) emailToFilter = [emailAccount];
          }
        }
        else if(isModify.value) {
          emailToFilter = item.emailAddress.filter(value => value.type === 't');
        }
        if (emailToFilter && emailToFilter.length > 0) {
          const emailToList = emailToFilter.map(value => value.address);
          item.requestMessage.listMailTo.push(...emailToList);
        }
        //email cc (check reply or modify)
        let emailCcFilter = [] as EmailAddress[];
        if(isReply.value){
          emailCcFilter = item.emailAddress.filter(value => value.type === 'c');
        }
        else if(isModify.value){
          emailCcFilter = item.emailAddress.filter(value => value.type === 'c')
        }
        if (emailCcFilter && emailCcFilter.length > 0) {
          const emailCcList = emailCcFilter.map(value => value.address);
          item.requestMessage.listMailCc.push(...emailCcList);
        }
        //email bcc
        const emailBccFilter = item.emailAddress.filter(value => value.type === 'b');
        if (emailBccFilter && emailBccFilter.length > 0) {
          const emailBccList = emailBccFilter.map(value => value.address);
          item.requestMessage.listMailBcc.push(...emailBccList);
        }
      }
    }

    function setAttachmentToRequestMessage(item: ItemConversationDetail){
      if (item.attachments.length > 0) {
        for (const attach of item.attachments) {
          const data = new FileAttachment();
          data.part = attach.part;
          data.name = attach.fileName;
          data.size = attach.size;
          data.messageId = item.messageId;
          item.requestMessage.fileAttachmentList.push(data);
        }
      }
    }

    function actionReplyConversation(item: ItemConversationDetail) {
      //init value
      showButtonReply.value = true;
      item.accodionHide = true;
      actionInitReplyOrForwardConversation(item, 'r');
      //init email to
      if (item.emailAddress.length > 0) {
        const emailToFilter = item.emailAddress.filter(value => value.address !== myUser.value.account && (value.type === 'f' || value.type === 't'));
        const emailAccount = item.emailAddress.find(value => value.address === myUser.value.account);
        if (emailToFilter && emailToFilter.length > 0) {
          const emailToList = emailToFilter.map(value => value.address);
          item.requestMessage.listMailTo.push(...emailToList);
        } else {
          if (emailAccount) item.requestMessage.listMailTo.push(emailAccount.address);
        }
      }
      //call emit
      tranferDataToMailNew(item.requestMessage);
    }

    function actionReplyAllConversation(item: ItemConversationDetail) {
      //init value
      actionInitReplyOrForwardConversation(item, 'r');
      //init email to
      setEmailToRequestMessage(item);
      //call emit
      tranferDataToMailNew(item.requestMessage);
    }

    function actionForwardConversation(item: ItemConversationDetail) {
      //init value
      showButtonReply.value = true;
      item.accodionHide = true;
      actionInitReplyOrForwardConversation(item, 'w');
      //attachmen file (nếu có)
      setAttachmentToRequestMessage(item);
      //call emit
      tranferDataToMailNew(item.requestMessage);
    }

    function actionPrintConversation(itemId: string){
      window.open(window.location.origin + '/print/' + itemId);
    }

    function actionDeleteConversation(conversation: ConversationDetail, type: boolean) {
      // init item conversation
      const itemDelete = new Item();
      itemDelete.conversationId = conversation.conversationId;
      itemDelete.fullName = conversation.itemList[0].subject;
      // Nếu type = false Xoá conversation vào thùng rác - Nếu type = true Xoá vĩnh viễn
      emitter.emit('show-modal-delete-mail-conversation', { item: itemDelete, selectedBox: [], forever: type });
    }

    async function actionShowOriginalConversation(item: ItemConversationDetail) {
      //call request
      const response = await ConversationDetailService.showOriginal(item, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          //set content
          contentOriginalConversationDetail.value = responseData.values;
          //show modal
          showModalOriginalConversationDetail.value = true;
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    // Đánh dấu thư rác
    async function actionSpamConversation(itemId: string, type: boolean) {
      // type = true -> mail spam : mail không phải spam
      await actionConversation(itemId, type ? 'spam' : '!spam');
      emitter.emit('show-conversation');
    }

    async function actionReadOrUnReadConversation(read: string, itemId: string) {
      const findConversation = conversation.value.itemList.find(value => value.conversationId === itemId);
      if (findConversation) findConversation.unread = true;
      await actionConversation(itemId, read);
      emitter.emit('mark-item-unread')
      await backConversation();
      // auto-reload unread count data folder list
      folderStore.reloadDataUnreadCountFolder();
    }

    function handleEmailAddress(emailAddress: EmailAddress[], index: number, type: string) {
      const length = emailAddress.filter((data) => data.type === type).length;
      return length === 0 ? '' : index === length - 1 ? '' : ',';
    }

    function actionDeleteMessageDraft(mailDataId: string) {
      const find = conversationDetail.value.itemList.find(value => {
        if (value.composeMessageDto) {
          return value.composeMessageDto.id === mailDataId;
        } else {
          return '';
        }
      });
      if (find) {
        find.composeMessageDto.showHide = false;
      }
      showButtonReply.value = false;
    }

    function trustImageByDomainOrDomainListByStore(itemSelected: ItemConversationDetail){
      //duyệt hết tất cả image theo mỗi item
      for(const item of itemSelected.nodeListImage){
        const srcContent = item.getAttribute('dfsrc') || '';
        const urlImage = srcContent ? new URL(srcContent) : '';
        if(urlImage){
          //add domain list
          const existed = itemSelected.trustImageDomainList.some(value => value === urlImage.host);
          if(!existed){
            itemSelected.trustImageDomainList.push(urlImage.host);
          }
          //check email
          if(myUser.value.trustImage && myUser.value.trustImage.byEmail && myUser.value.trustImage.byEmail.length > 0){
            for(const email of myUser.value.trustImage.byEmail){
              if(email === itemSelected.trustImageEmail){
                //đóng thông báo
                itemSelected.imageMailAlert = false;
                //mở hình ảnh theo email
                if (srcContent) {
                  item.setAttribute('src', srcContent);
                }
              }
            }
          }
        }
      }
    }

    function initDetectHasImage(itemSelected: ItemConversationDetail) {
      //init value
      if (itemSelected.elementContent.querySelectorAll('img[dfsrc]')) {
        itemSelected.trustImageDomainList = [];
        itemSelected.nodeListImage = itemSelected.elementContent.querySelectorAll('img[dfsrc]') as NodeListOf<Element>;
        if (itemSelected.nodeListImage && itemSelected.nodeListImage.length > 0) {
          //bật thông báo
          itemSelected.imageMailAlert = true;
          //lấy địa chỉ người gửi
          const findSender = itemSelected.emailAddress.find(value => value.address && value.type === 'f');
          if (findSender) {
            itemSelected.trustImageEmail = findSender.address;
          }
          trustImageByDomainOrDomainListByStore(itemSelected);
        }
      }
    }

    async function saveTrustImageByEmail(itemSelected: ItemConversationDetail, email: string) {
      //check email existed
      const existed = myUser.value.trustImage ? myUser.value.trustImage.byEmail.findIndex(value => value === email) : -1;
      if (existed < 0) {
        myUser.value.trustImage.byEmail.push(email);
        //update usser
        await myStore.updateUser(myUser.value, myStore.token);
        //close alert
        itemSelected.imageMailAlert = false;
      }
    }

    async function actionTrustImage(itemSelected: ItemConversationDetail, domain: string, email: string) {
      if (itemSelected.nodeListImage) {
        for (const item of itemSelected.nodeListImage) {
          //lấy content
          const srcContent = item.getAttribute('dfsrc');
          //Trường hợp click vào hiển thị ảnh
          if (!domain && !email) {
            item.setAttribute('src', srcContent);
            //close alert
            itemSelected.imageMailAlert = false;
          }
          //trương hợp click vào email
          else if(!domain && email){
            item.setAttribute('src', srcContent);
            //add email to store
            await saveTrustImageByEmail(itemSelected, email);
          }
        }
      }
    }

    function actionFilterSelected(itemList: ItemConversationDetail[]){
      if(itemList && itemList.length > 0){
        //init value conversation
        let sender = '';
        if(itemList[0].emailAddress && itemList[0].emailAddress.length > 0){
          for(const item of itemList[0].emailAddress){
            if(item.type === 'f'){
              sender = item.address;
              break;
            }
          }
        }
        const conversationItem = {
          sender: sender,
          subject: itemList[0].subject,
        } as Item;
        emitter.emit('show-modal-add-filter-by-conversation', conversationItem);
      }
    }

    async function actionDownloadFileAttachment(item: ItemConversationDetail, attachment: Attachment, multiAttachment?: Attachment[]){
      if(item.messageId && attachment.part){
        //init request
        const itemRequest = {
          messageId: item.messageId,
          attachments: [] as Attachment[],
        } as ItemConversationDetail;
        if(multiAttachment){
          itemRequest.subject = item.subject;
          itemRequest.attachments.push(...multiAttachment);
        }
        else{
          itemRequest.attachments.push({part: attachment.part} as Attachment);
        }
        //call request
        const response = await FileAttachmentService.downloadAttachment(itemRequest, myStore.token);
        //Kiểm tra backend có trả error ko
        const type = response.headers['content-type'];
        const blob = new Blob([response.data], { type: type });
        const text = await blob.text();
        if(tryParseJSONObject(text)){
          const errorObject = JSON.parse(text);
          // Set thông báo thất bại nếu theo cấu trúc backend
          if(errorObject.message && errorObject.status && errorObject.values && errorObject.values.error){
            showToastMessage(errorObject.values.error, true);
          }
          //Ngược lại thì tải file về
          else{
            saveAs(blob, multiAttachment ? item.subject + '.zip' : attachment.fileName);
          }
        }
        else{
          saveAs(blob, multiAttachment ? item.subject + '.zip' : attachment.fileName);
        }
      }
      else{
        showToastMessage(undefined, true);
      }
    }

    // numberChange = -1: prev mail . numberChange = 1: next mail
    async function changeConversationDetails (numberChange: number) {
      // Lấy number next vượt qua conversation store lengh thì gọi api
      if (conversationStore.conversation.itemList.length >= Number(conversationStore.searchRequest.limit) - 1
          && locationConversationDetail.value === conversationStore.conversation.itemList.length - 1) {
        // set offset
        conversationStore.searchRequest.offset = String(conversationStore.conversation.itemList.length);
        // lấy thêm message
        await conversationStore.getConversation();
        // set total page
        numberPage.value = Number(conversationStore.conversation.itemList.length);
      }
      // Tìm conversation cũ
      const indexConversation = conversationStore.conversation.itemList
          .sort((a: Item, b: Item) => props.sortBy === 'dateDesc' ?
              +new Date(b.conversationDate) - +new Date(a.conversationDate) : +new Date(a.conversationDate) - +new Date(b.conversationDate))
          .findIndex(c => c.conversationId === conversationDetail.value.conversationId) + numberChange;
      const olderConversation = conversationStore.conversation.itemList[indexConversation];
      if (olderConversation) {
        // Đánh dấu item đã đọc trong store
        olderConversation.unread = false;
        // find conversation id va reset
        await findConversationDetail(olderConversation.conversationId, indexConversation);
      }
    }

    async function findConversationDetail (conversationId: string, indexConversation?: number) {
      //init request
      const itemFind = new SearchConvRequest();
      itemFind.cid = conversationId;
      // //call request
      const response = await ConversationDetailService.find(itemFind, myStore.token);
      if (response) {
        const responseData: ResponseData = response.data;
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          // set value cho conversation
          conversationDetail.value.conversationId = responseData.values.conversationId;
          conversationDetail.value.hasMore = responseData.values.hasMore;
          conversationDetail.value.itemList = responseData.values.itemList;
          conversationIdSelected.value = conversationDetail.value.conversationId;
          // set vị trí mail
          if (indexConversation || indexConversation === 0) locationConversationDetail.value = indexConversation;
          // re-init conversation details
          await handleConversationDetailWhenMounted();
        }
      }
    }

    async function handleConversationDetailWhenMounted () {
      // Init Get Converstation
      if (conversationDetail && conversationDetail.value.itemList.length > 0) {
        // TigerBui` - set mặc định mở rộng nội dung mail gửi mới nhất
        const sortConversationDetail = conversationDetail.value.itemList.sort((a: any, b: any) => {
          const ad = new Date(a.messageDate) as any;
          const bd = new Date(b.messageDate) as any;
          return (bd - ad);
        });
        sortConversationDetail[0]['newConversation'] = true;
        if (conversationOpenStatus.value && conversationOpenStatus.value.length > 0) {
          for (const item of conversationOpenStatus.value) {
            let index = conversationDetail.value.itemList.findIndex((c) => c.messageId === item.messageId);
            if (index && item) {
              if (sortConversationDetail[index]['accodionHide']) sortConversationDetail[index]['accodionHide'] = true;
            }
          }
        }
      }
      //mặc định khi truy cập chi tiết thì set trạng thái conversation detail là đã đọc
      await actionConversation(String(conversationIdSelected.value), 'read');
      //detect has image trong conversation detail dau tien
      if(conversationDetail.value.itemList && conversationDetail.value.itemList.length > 0){
        for(const item of conversationDetail.value.itemList){
          initDetectHasImage(item);
        }
      }
    }

    onMounted(async () => {
      hasDisabledReplyAndForward.value = route.path.endsWith('Drafts');
      // Init Get Converstation
      await handleConversationDetailWhenMounted();
      //reload seo title
      seoTitleStore.initGetSeoTitle(t(conversationDetail.value.itemList).safeArray.length > 0 ? conversationDetail.value.itemList[0].subject : '');
    });

    return {
      env,
      eAdd,
      dayjs,
      helper,
      mailOpen,
      locale,
      myStore,
      emitter,
      timeAgo,
      isReply,
      onChange,
      isModify,
      mailWrap,
      numberPage,
      folderPath,
      prettyBytes,
      messageDetail,
      zimbraHostInfo,
      conversationDetail,
      formDataDeleteAttachment,
      locationConversationDetail,
      actionDownloadFileAttachment,
      expandedItemConversation,
      hasDisabledReplyAndForward,
      modalContentRemoveAttachment,
      itemConversationDetailSelected,
      contentOriginalConversationDetail,
      showModalOriginalConversationDetail,
      ToggleEmail,
      actionDeleteTag,
      actionTrustImage,
      actionChangeFlag,
      backConversation,
      handleEmailAddress,
      actionSpamConversation,
      actionReplyConversation,
      actionPrintConversation,
      findConversationDetail,
      changeConversationDetails,
      actionModifyConversation,
      actionDeleteMessageDraft,
      actionDeleteConversation,
      actionForwardConversation,
      actionRemoveOneAttachment,
      actionRemoveAllAttachment,
      actionReplyAllConversation,
      actionShowConversationByTag,
      actionReadOrUnReadConversation,
      actionShowOriginalConversation,
      actionFilterSelected,
      showButtonReply,
      rewriteMailWithLink
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/colors";
@import "@/assets/scss/mixin/_media-screen.scss";
html.inet-mail-themes {
  &.dark {
    .accordion {
      .accordion {
        &-item {
          border-color: rgba(black, .15)
        }
      }
    }
  }

  .inbox-conversation-detail {
    > .accordion {
      &-group {
        @include mediaScreenWidth(min, md) {
          height: calc(100vh - 215px);
        }
        @include mediaScreenWidth(min, lg){
          height: calc(100vh - 165px);
        }
      }
    }
    .mail-content {
      &.overflow-auto {
        &::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(black, .45);
        }

        &::-webkit-scrollbar-track {
          border-radius: 25px;
        }
      }
    }
  }

  .accordion {
    .accordion {
      &-item {
        padding: 1rem;
        border-color: rgba(black, .08);
      }
    }
  }
  .mail-content {
    img {
      display: initial;
    }
  }
  blockquote {
    border-left: 5px solid #ccc!important;
    padding: 0.5em 10px 0 10px;
  }
  .leading-relaxed {
    .reply-bottom-group {
      transition: opacity .2s linear 0s;
      opacity: 0;
    }
    &:hover {
      .reply-bottom-group {
        opacity: 1;
      }
    }
    .mail-compose-item {
      margin-left: 0;
      box-shadow: 0 0 6px 2px rgba(black, .15);
      border-radius: 10px;
      .header {
        display: none;
      }
      .footer {
        box-shadow: 0px -3px 3px 0 rgb(0 0 0 / 15%);
        position: relative;
        margin: 0 -13px;
        padding: 10px 19px;
      }
    }
  }
}
</style>
