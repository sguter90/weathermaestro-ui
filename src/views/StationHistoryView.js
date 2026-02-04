import {viewManager} from "../lib/ViewManager.js";



export async function renderStationHistoryView(params) {
    viewManager.showLoading('Loading station history...');

    const {id} = params;

    try {
        const html = `
        `;
        viewManager.render(html);
    } catch (error) {
        console.log(error);
        viewManager.showError(error.message);
    }
}
