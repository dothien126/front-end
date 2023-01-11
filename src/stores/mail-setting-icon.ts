
    const settingMnGlobal = [
        {
            label: 'New folder',
            namevl: 'newfolder'
        },
        {
            label: 'Share folder',
            namevl: 'sharefolder'
        },
        {
            label: 'Edit folder',
            namevl: 'editfolder'
        },
        {
            label: 'Open tab',
            namevl: 'opentab'
        }
    ];
    const colorDf = {
        slateDf: '#94a3b8'
    };
    const MailSettingIcon = {
        Inbox: {
            iconName: 'mail',
            settingMnlist: settingMnGlobal
        },
        Sent: {
            iconName: 'send',
            settingMnlist: settingMnGlobal
        },
        Drafts: {
            iconName: 'file',
            settingMnlist: settingMnGlobal.slice(1, settingMnGlobal.length)
        },
        Junk: {
            iconName: 'mail-x',
            settingMnlist: [
                {
                    label: 'Mark all as read',
                    namevl: 'markallread'
                },
                {
                    label: 'Empty junk',
                    namevl: 'emptyjunk'
                },
                {
                    label: 'Open tab',
                    namevl: 'opentab'
                }
            ]
        },
        Trash: {
            iconName: 'trash',
            settingMnlist: [
                {
                    label: 'New folder',
                    namevl: 'newfolder'
                },
                {
                    label: 'Empty trash',
                    namevl: 'emptytrash'
                },
                {
                    label: 'Open tab',
                    namevl: 'opentab'
                }
            ]
        },
        Chats: {
            iconName: 'message-square'
        },
        hahaha: {
            color: '#7c3aed'
        },
        tessst: {
            color: '#e11d48'
        },
        newfolder: {
            iconName: 'folder-plus',
            color: colorDf.slateDf
        },
        sharefolder: {
            iconName: 'folder-symlink',
            color: colorDf.slateDf
        },
        editfolder: {
            iconName: 'folder-edit',
            color: colorDf.slateDf
        },
        opentab: {
            iconName: 'external-link',
            color: colorDf.slateDf
        },
        emptyjunk: {
            iconName: 'trash',
            color: colorDf.slateDf
        },
        emptytrash: {
            iconName: 'trash',
            color: colorDf.slateDf
        },
        markallread: {
            iconName: 'mail-check',
            color: colorDf.slateDf
        },
        pastday: {
            iconName: 'calendar-clock'
        },
        attachfile: {
            iconName: 'paperclip'
        },
        contacts: {
            iconName: 'contact'
        },
        global: {
            iconName: 'globe-2'
        },
        filtersliders: {
            iconName: 'sliders-horizontal'
        }
    };

export default MailSettingIcon;