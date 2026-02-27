export const printStyle = `
@page {
  size: auto;
  margin: 0.5cm 0.5cm;
  @top-center {
    content: '';
    font-size: 14px;
    color: #333;
  }
  @bottom-right {
    content: '第 ' counter(page) ' 页 / 共 ' counter(pages) ' 页';
    font-size: 12px;
    color: #666;
  }
}
.print {
  zoom: 0.65;
}
.logo {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
}
.main-logo {
  height: 32px;
  width: 233px;
  margin-right: auto;
}
.sub-title {
  height: 20px;
  width: 269px;
  margin-right: auto;
}
.cell {
  display: flex;
  align-items: center;
  min-height: 51px;
  padding-left: 10px;
  border-bottom: 1px solid #000;
}
.content {
  width: 100%;
  margin-top: 30px;
}
.content .row_1 {
  display: flex;
  border: 1px solid #000;
}
.content .row_1 .title {
  flex: 1;
  color: #fff;
  font-size: 48px;
  line-height: 123px;
  background-color: #423f40;
  padding-left: 60px;
  -webkit-print-color-adjust: exact;
  box-sizing: border-box;
  border-right: 1px solid #000;
}
.content .row_1 .sub-title {
  width: 388px;
  padding-top: 18px;
  padding-left: 10px;
  color: #333;
  font-size: 18px;
  box-sizing: border-box;
}
.content .row_1 .sub-title .sub-title-row {
  margin-bottom: 5px;
}
.content .row_1 .sub-title .label {
  width: 109px;
  line-height: 26px;
  color: #56585a;
}
.content .row_1 .sub-title .value {
  line-height: 26px;
  color: #242527;
}
.content .row_2 {
  display: flex;
  align-items: center;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
.content .row_2 .row_2_title {
  width: 180px;
  background-color: #f0f0f0;
  color: #423f40;
  font-size: 16px;
  box-sizing: border-box;
  border-right: 1px solid #000;
  border-left: 1px solid #000;
}
.content .row_2 .row_2_title:first-of-type {
  border-left: 0;
}
.content .row_2 .row_2_content {
  flex: 1;
  box-sizing: border-box;
}
.content .row_6 {
  display: flex;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
.content .row_6 .row_6_item {
  color: #56585a;
  border-left: 1px solid #000;
  box-sizing: border-box;
}
.content .row_6 .row_6_item:first-of-type {
  border-left: 0;
}
.content .row_7 {
  display: flex;
  align-items: center;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  background-color: #f0f0f0;
}
.content .row_7 .row_7_item {
  height: 100%;
  color: #56585a;
  border-left: 1px solid #000;
  box-sizing: border-box;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
.content .row_7 .row_7_item:first-of-type {
  border-left: 0;
}
.content .row_8 {
  display: flex;
  height: 51px;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
.content .row_8:last-of-type {
  border-bottom: 0;
}
.content .row_8 .row_8_item {
  color: #56585a;
  border-left: 1px solid #000;
  box-sizing: border-box;
}
.content .row_8 .row_8_item:first-of-type {
  border-left: 0;
}
.content .page-break {
  page-break-before: always;
  margin-top: 1cm;
}
.content .border-top {
  border-top: 1px solid #000;
}
.content .row_6_itemitem_1 {
  width: 90px;
  height: 51px;
}
.content .row_6_itemitem_2 {
  flex: 1;
  height: 51px;
}
.content .row_6_itemitem_3 {
  flex: 1;
  height: 51px;
}
.content .row_6_itemitem_4 {
  flex: 1;
  height: 51px;
}
.content .row_6_itemitem_5 {
  width: calc(3em + 22px);
  height: 51px;
}
.content .row_6_itemitem_6 {
  width: calc(4em + 22px);
  height: 51px;
}
.content .row_6_itemitem_7 {
  width: calc(3em + 22px);
  height: 51px;
}
.content .row_6_itemitem_8 {
  width: calc(3em + 22px);
  height: 51px;
}
.content .row_6_itemitem_9 {
  width: calc(4em + 22px);
  height: 51px;
}
`
