import { ElMessageBox } from 'element-plus'

let lastSrcs: any; let needTip = true;

const scriptReg = /<script.*src=["'](?<src>[^"']+)/gm;

const extractNewScripts = async () => {
    const html = await fetch('/web_self_supervision=' + Date.now()).then((resp) => resp.text());
    scriptReg.lastIndex = 0;
    let result: any = [];
    let match: RegExpExecArray;
    while ((match = scriptReg.exec(html) as RegExpExecArray)) {
        match?.groups?.src && result.push(match.groups.src || '');
    }
    return result;
}

const needUpdate = async () => {
    const newScripts = await extractNewScripts();
    if (!lastSrcs) {
        lastSrcs = newScripts;
        return false;
    }
    let result = false;
    if (lastSrcs.length !== newScripts.length) {
        result = true;
    }
    for (let i = 0; i < lastSrcs.length; i++) {
        if (lastSrcs[i] !== newScripts[i]) {
            result = true;
            break
        }
    }
    lastSrcs = newScripts;
    return result;
}
const DURATION = 60000;

export const autoRefresh = () => {
    setTimeout(async () => {
        const isNoShow = (window?.location?.pathname || '').includes('/bigScreen/') || (window?.location?.pathname || '').includes('/screen/');
        const willUpdate = await needUpdate();
        if (willUpdate && !isNoShow) {
            setTimeout(() => {
                ElMessageBox.confirm('检测到页面有内容更新,为了功能的正常使用,是否立即刷新？', '更新提示', {
                    confirmButtonText: '确认',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    location.reload();
                })
            }, 0);
            needTip = false;
        }
        if (needTip) {
            autoRefresh();
        }
    }, DURATION)
}
