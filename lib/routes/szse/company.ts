import type { Route } from '@/types';
import got from '@/utils/got';

const baseUrl = 'https://www.szse.cn';

export const route: Route = {
    path: '/company/:stock',
    name: '深交所公司公告',
    url: 'https://www.szse.cn/disclosure/listed/notice/index.html',
    maintainers: ['yhz200251'],
    handler,
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
        title: `深交所公告 ${stock}`,
        link: `${baseUrl}/disclosure/listed/notice/index.html?stock=${stock}`,
        item: list.map((item) => ({
            title: item.title,
            link: `https://disc.static.szse.cn/download${item.attachPath}`,
            description: item.title,
            pubDate: item.publishTime,
        })),
    };
}
