import { WebRTCsamplePage } from './app.po';

describe('web-rtcsample App', () => {
  let page: WebRTCsamplePage;

  beforeEach(() => {
    page = new WebRTCsamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
