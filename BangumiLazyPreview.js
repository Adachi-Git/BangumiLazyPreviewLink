// ==UserScript==
// @name         BangumiLazyPreview
// @namespace    https://github.com/Adachi-Git/BangumiLazyPreviewLink
// @version      0.1
// @description  Lazy load links and show their titles
// @author      Jirehlov (Original Author), Adachi (Current Author)
// @include        /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/.*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    let lazyLinks = [];

    const replaceLinkText = (link) => {
        const linkURL = link.href;
        if (link.textContent === link.href) {
            fetch(linkURL)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(data, 'text/html');
                    const title = htmlDoc.querySelector('h1.nameSingle a');
                    let titleText = title ? title.textContent : '';
                    if (link.href.includes('subject') || link.href.includes('ep')) {
                        const chineseName = title ? title.getAttribute('title') : '';
                        if (chineseName) {
                            if (titleText) {
                                titleText += ' | ' + chineseName;
                            } else {
                                titleText = chineseName;
                            }
                        }
                    }
                    if (link.href.includes('ep')) {
                        const epTitle = htmlDoc.querySelector('h2.title');
                        if (epTitle) {
                            epTitle.querySelectorAll('small').forEach(small => small.remove());
                            const epTitleText = epTitle.textContent;
                            if (epTitleText) {
                                if (titleText) {
                                    titleText += ' | ' + epTitleText;
                                } else {
                                    titleText = epTitleText;
                                }
                            }
                        }
                    }
                    if (titleText) {
                        link.textContent = titleText;
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    const lazyLoadLinks = () => {
        lazyLinks.forEach(link => {
            replaceLinkText(link);
        });
        // 清空已处理的链接
        lazyLinks = [];
    };

    // 检查滚动事件来触发懒加载
    window.addEventListener('scroll', () => {
        // 在滚动事件中，检查链接是否在视口中，并将未处理的链接添加到待处理列表
        allLinks.forEach(link => {
            const rect = link.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                lazyLinks.push(link);
            }
        });
        // 当页面滚动停止一段时间后再执行懒加载
        clearTimeout(timer);
        timer = setTimeout(lazyLoadLinks, 200); // 等待200毫秒
    });

    // 获取页面上的所有链接
    const allLinks = document.querySelectorAll('a[href^="https://bgm.tv/subject/"], a[href^="https://chii.in/subject/"], a[href^="https://bangumi.tv/subject/"], a[href^="https://bgm.tv/ep/"], a[href^="https://chii.in/ep/"], a[href^="https://bangumi.tv/ep/"], a[href^="https://bgm.tv/character/"], a[href^="https://chii.in/character/"], a[href^="https://bangumi.tv/character/"], a[href^="https://bgm.tv/person/"], a[href^="https://chii.in/person/"], a[href^="https://bangumi.tv/person/"]');

    // 设置定时器变量
    let timer;

})();
