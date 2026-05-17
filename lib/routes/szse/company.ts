import type { Route } from '@/types';
import got from '@/utils/got';

const baseUrl = 'https://www.szse.cn';

export const route: Route = {
    path: '/company/:stock',
    categories: ['finance'],
    example: '/szse/company/002624',
    parameters: {
        stock: '股票代码，例如 002624',
    },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['szse.cn/disclosure/listed/notice/index.html'],
            target: '/company/:stock',
        },
    ],
    name: '上市公司公告',
    maintainers: ['yhz200251'],
    handler,
    url: 'szse.cn/disclosure/listed/notice/index.html',
};

async function handler(ctx) {
    const stock = ctx.req.param('stock');

    const response = await got.post(`${baseUrl}/api/disc/announcement/annList`, {
        headers: {
            Referer: `${baseUrl}/disclosure/listed/notice/index.html?stock=${stock}`,
            'Content-Type': 'application/json',
        },
        json: {
            stock: [stock],
            pageSize: 20,
            pageNum: 1,
            channelCode: ['listedNotice_disc'],
        },
    });

    const list = response.data?.data || [];

    return {
        title: `深交所上市公司公告 - ${stock}`,
        link: `${baseUrl}/disclosure/listed/notice/index.html?stock=${stock}`,
        item: list.map((item) => ({
            title: item.title,
            link: item.attachPath ? `https://disc.static.szse.cn/download${item.attachPath}` : `${baseUrl}/disclosure/listed/notice/index.html?stock=${stock}`,
            description: item.title,
            pubDate: item.publishTime ? new Date(item.publishTime).toUTCString() : undefined,
        })),
    };
}
}
