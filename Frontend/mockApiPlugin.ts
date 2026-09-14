import type { Plugin } from 'vite';

// In-memory persistent books database for the dev server
let booksDatabase = [
  {
    id: 'book-sideways-city',
    title: 'The Sideways City',
    prompt: 'A quiet city where gravity tilts westward and lamplight paints the rooftops',
    style: 'watercolor',
    pageCount: 8,
    createdAt: '2026-09-10T12:00:00.000Z',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbn674iMCijkvfkMueFK3ptfVbZgk9v5RzgPBs4SHXD5UVEoUatrtZzYZfDFVDVoNMED9vdDACnKRgnF6zBfwOfNj_533Gp3TJSSPbhgrsFeEZ6U1zGuJKKQZaq10julQWuh8mc9z3AyqHH93eMbe5RMuzxZ0Jq2OFbuqvSY-mpAV9-KbFB2LCl1TB8y3cnxhgzTNwJUi22ZRA6Yq7B4Laiugzmu7rc0rEaAPnnxAGStSa41u8tmh7',
    pages: [
      {
        pageNumber: 1,
        title: 'The Horizon Tilts',
        text: 'Oliver first noticed the change when his teacup slid horizontally across the kitchen table. Outside, the cobblestones curved upward into the sky, where trams glided along vertical facades without spilling a single passenger.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAbn674iMCijkvfkMueFK3ptfVbZgk9v5RzgPBs4SHXD5UVEoUatrtZzYZfDFVDVoNMED9vdDACnKRgnF6zBfwOfNj_533Gp3TJSSPbhgrsFeEZ6U1zGuJKKQZaq10julQWuh8mc9z3AyqHH93eMbe5RMuzxZ0Jq2OFbuqvSY-mpAV9-KbFB2LCl1TB8y3cnxhgzTNwJUi22ZRA6Yq7B4Laiugzmu7rc0rEaAPnnxAGStSa41u8tmh7',
        caption: 'Streets built sideways against the dawn',
      },
      {
        pageNumber: 2,
        title: 'Steps Along the Wall',
        text: 'Stepping off his front porch, he did not fall downward. He stepped directly onto the brick wall of the clocktower. Rain fell toward the west, like silver threads carried by an invisible hand through the sleepy avenue.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDezYQgC1FdbbgwZrsQe6JKal1KvTBhsZ_SExmStBeH1cusjuJRHm1G-zDxm4jtD22YLXOqwTdHEbaxrBHSfuWbtPJ6Xm75stvvrCzHAu9yfJoXouRZOd6aJrGD0Grw51ABpb4XuZHbJfceECyi2EVhNpSlWbgvXfENFtJcd6psl4WOjWrM81cFpu3FEDaCZh_Q9FOdYCnJzFc33Xt4OXoj45UWycsinyfuMh32YNNaeq-2xYbgedlJ',
        caption: 'Oliver tests the sideways gravity with a copper key',
      },
      {
        pageNumber: 3,
        title: 'The Floating Cartographer',
        text: "High above the rooftop garden, an elderly woman in velvet spectacles was rolling up a map of the city. 'Do not fight the lean,' she advised gently. 'In Storyverse, directions answer to whichever dream you speak aloud.'",
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCH9Oo-jkhLoQ7bqQOdPL7ROrQr64fFp0mcoVw-wxFVgAA2XSp1OlYNRj4EfUpHQtLDncJLmyImjTxSxTOJcsf89f0ki3EMfolUWK0wRZ1LCL8XtkOxjPDQhRqeccvuB-us9tqEslcmbYesKw5psVsMSFOJ1iAGTlwMF621Wgc7Hy95ELUD379oZq9jHaWSVCNbT4M7Z626cOCuaL-34WiC2LMbjFP6Lnsu4W1osNfmILRmyfF-XPYB',
        caption: 'The evening bells ringing sideways across the clouds',
      },
    ],
  },
  {
    id: 'book-clockwork-forest',
    title: 'The Clockwork Forest',
    prompt: 'A forest of brass leaves and winding gears where mechanical songbirds tell the time',
    style: 'comic',
    pageCount: 6,
    createdAt: '2026-09-08T09:15:00.000Z',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDci_yuBBuoczXQH0yVtvO36cmFcgFgGjmQB81LqQEhJi-2N9qnf8ay9auCzoTAkhCPF-FaXcqW24ee0qxHLSi7OZ7T7cW2t0noK0BFRWo3D8LkAQrW60Ztf-nKkg4CnoZ4I9LMkJ1AxrbqT0bWKL06xXaEA8kSVIS0DnJxDBlHmgT4s7ixz-l-hx-N3wAUQ5QHIUD_eLmJLWx-gOPHdFjkLIDYeBtN9pOHsBZeBfnQ5dVKIxJfN7dk',
    pages: [
      {
        pageNumber: 1,
        title: 'The Brass Canopy',
        text: 'Deep within the valley of Oakhaven, the branches did not sway in the breeze. They clicked. Gears turned inside the boles of giant copper trees, each leaf polished to a soft luster.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDci_yuBBuoczXQH0yVtvO36cmFcgFgGjmQB81LqQEhJi-2N9qnf8ay9auCzoTAkhCPF-FaXcqW24ee0qxHLSi7OZ7T7cW2t0noK0BFRWo3D8LkAQrW60Ztf-nKkg4CnoZ4I9LMkJ1AxrbqT0bWKL06xXaEA8kSVIS0DnJxDBlHmgT4s7ixz-l-hx-N3wAUQ5QHIUD_eLmJLWx-gOPHdFjkLIDYeBtN9pOHsBZeBfnQ5dVKIxJfN7dk',
        caption: 'Gilded cogs turning in the early twilight',
      },
    ],
  },
];

const styleArtwork = {
  comic: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDci_yuBBuoczXQH0yVtvO36cmFcgFgGjmQB81LqQEhJi-2N9qnf8ay9auCzoTAkhCPF-FaXcqW24ee0qxHLSi7OZ7T7cW2t0noK0BFRWo3D8LkAQrW60Ztf-nKkg4CnoZ4I9LMkJ1AxrbqT0bWKL06xXaEA8kSVIS0DnJxDBlHmgT4s7ixz-l-hx-N3wAUQ5QHIUD_eLmJLWx-gOPHdFjkLIDYeBtN9pOHsBZeBfnQ5dVKIxJfN7dk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuArN-Cg1pXKMbJ0AML5IrHOlGCrAC6w-ETNwUJhZRLBrI9zxVG_i5qpuWt6EZ83EhO6jPIcFixZhsAiWnepwcFTuCgmeh7KvF3zqvLng7ZTzBb-BT1N6pa0dF7YqYDsXbhTrX7ea-bJN9IayBsTYogjaNZ7YPzKBwXycwvDaUCDne_NWCtB1hXnco77FR3FVe_LExudpk2FiIdv-Ip8QXKx3Qh8Mzzmq0ZaKVCWTrBHp2B3uM-VzEMj',
  ],
  ink: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCH9Oo-jkhLoQ7bqQOdPL7ROrQr64fFp0mcoVw-wxFVgAA2XSp1OlYNRj4EfUpHQtLDncJLmyImjTxSxTOJcsf89f0ki3EMfolUWK0wRZ1LCL8XtkOxjPDQhRqeccvuB-us9tqEslcmbYesKw5psVsMSFOJ1iAGTlwMF621Wgc7Hy95ELUD379oZq9jHaWSVCNbT4M7Z626cOCuaL-34WiC2LMbjFP6Lnsu4W1osNfmILRmyfF-XPYB',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAxR09jdifjF2QluDFFBgDkDp5waodUb4Gb6N3unsigzf0g0iadbSCBx6pFkcCP_iO14c6aR3-fs5yJgCReVlt9u_vOYVcgSu8I0KQYssSXQPc9XFEg0sw5EC6hT5alCE4r8fSPXe5GXXjIMJLEo1ZjxH0I9KnHjuMXG2qOsa7tnuqG8tFCCrsmjysFDRou6raEaIW3jcUNevM-UN0J8jfjg0T4gsyPc7LN7VMZt4q_EghspHl3xcWR',
  ],
  watercolor: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAbn674iMCijkvfkMueFK3ptfVbZgk9v5RzgPBs4SHXD5UVEoUatrtZzYZfDFVDVoNMED9vdDACnKRgnF6zBfwOfNj_533Gp3TJSSPbhgrsFeEZ6U1zGuJKKQZaq10julQWuh8mc9z3AyqHH93eMbe5RMuzxZ0Jq2OFbuqvSY-mpAV9-KbFB2LCl1TB8y3cnxhgzTNwJUi22ZRA6Yq7B4Laiugzmu7rc0rEaAPnnxAGStSa41u8tmh7',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDezYQgC1FdbbgwZrsQe6JKal1KvTBhsZ_SExmStBeH1cusjuJRHm1G-zDxm4jtD22YLXOqwTdHEbaxrBHSfuWbtPJ6Xm75stvvrCzHAu9yfJoXouRZOd6aJrGD0Grw51ABpb4XuZHbJfceECyi2EVhNpSlWbgvXfENFtJcd6psl4WOjWrM81cFpu3FEDaCZh_Q9FOdYCnJzFc33Xt4OXoj45UWycsinyfuMh32YNNaeq-2xYbgedlJ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyl195-f2IszjAs9QrroJuoOS4eX9K4Q_x6NYcaBw8Hk9mQ-zwI5Ao5JcgdWClbfi4CfK9l9XCpEZogIe3qjTOkdDX_l7pckKbdMVTn8C8fDUsc9KiBoCSdKhtrqLiuUw59dVfEIuxlNNGXBji6j_VZkjEu-b49nKshtZwv643eTTLuoc5NOOFk1PCtDSXS2-I5yLbFCbpcd0s55SWG1sL5CNYajJCB8G30R09Y2N2zFaSxlUUUNUH',
  ],
};

function readBody(req: any): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
  });
}

export function mockApiPlugin(): Plugin {
  return {
    name: 'storyverse-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        const method = req.method?.toUpperCase() || 'GET';

        // 1. GET /api/styles
        if (url === '/api/styles' && method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              styles: [
                { key: 'comic', label: 'Color Comic' },
                { key: 'ink', label: 'Black & White Ink' },
                { key: 'watercolor', label: 'Storybook Watercolor' },
              ],
              default: 'watercolor',
            })
          );
        }

        // 2. POST /auth/login
        if (url === '/auth/login' && method === 'POST') {
          const raw = await readBody(req);
          let body: any = {};
          try {
            body = JSON.parse(raw);
          } catch {}

          const { email, password } = body;
          if (!email || !password || password.length < 6) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Incorrect email or password' }));
          }

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              token: 'token_' + Date.now(),
              user: {
                id: 'usr_' + Math.random().toString(36).substring(2, 9),
                email,
                name: email.split('@')[0],
              },
            })
          );
        }

        // 3. POST /auth/register
        if (url === '/auth/register' && method === 'POST') {
          const raw = await readBody(req);
          let body: any = {};
          try {
            body = JSON.parse(raw);
          } catch {}

          const { email, password } = body;
          if (!email || !password) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Email and password are required' }));
          }

          if (email.toLowerCase() === 'taken@storyverse.com') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Email already in use' }));
          }

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              token: 'token_' + Date.now(),
              user: {
                id: 'usr_' + Math.random().toString(36).substring(2, 9),
                email,
                name: email.split('@')[0],
              },
            })
          );
        }

        // 4. GET /books
        if (url === '/books' && method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify(booksDatabase));
        }

        // 5. POST /books/generate
        if (url === '/books/generate' && method === 'POST') {
          const raw = await readBody(req);
          let body: any = {};
          try {
            body = JSON.parse(raw);
          } catch {}

          const { prompt, pageCount = 8, style = 'watercolor' } = body;
          if (!prompt || typeof prompt !== 'string') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            return res.end(
              JSON.stringify({
                error: 'Invalid story prompt',
                details: 'Please provide a descriptive prompt for your storybook.',
              })
            );
          }

          const count = parseInt(pageCount, 10) || 8;
          const artList =
            (styleArtwork as any)[style] || styleArtwork.watercolor;

          const words = prompt.trim().split(' ');
          const titleWords = words.slice(0, 4).join(' ');
          const bookTitle =
            titleWords.charAt(0).toUpperCase() + titleWords.slice(1);

          const pages = [];
          for (let i = 1; i <= count; i++) {
            const imgIndex = (i - 1) % artList.length;
            pages.push({
              pageNumber: i,
              title:
                i === 1
                  ? 'The Beginning'
                  : i === count
                  ? 'The Horizon Reached'
                  : `Chapter ${i}`,
              text:
                i === 1
                  ? `It all began with an idea: "${prompt}". The world shifted slightly as the ink dried on the first morning.`
                  : `Across page ${i}, the atmosphere deepened. Every detail answered to the storyteller's voice, carrying the narrative forward into light and shadow.`,
              image: artList[imgIndex],
              caption: `Page ${i} • ${style.charAt(0).toUpperCase() + style.slice(1)} study`,
            });
          }

          const newBook = {
            id: 'book_' + Math.random().toString(36).substring(2, 9),
            title: bookTitle || 'A New Story',
            prompt,
            style,
            pageCount: count,
            createdAt: new Date().toISOString(),
            coverImage: pages[0].image,
            pages,
          };

          booksDatabase.unshift(newBook);

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify(newBook));
        }

        // 6. GET /books/:id
        if (url.startsWith('/books/') && method === 'GET') {
          const id = url.replace('/books/', '');
          const book = booksDatabase.find((b) => b.id === id);
          res.setHeader('Content-Type', 'application/json');
          if (book) {
            res.statusCode = 200;
            return res.end(JSON.stringify(book));
          } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Book not found' }));
          }
        }

        // 7. DELETE /books/:id
        if (url.startsWith('/books/') && method === 'DELETE') {
          const id = url.replace('/books/', '');
          booksDatabase = booksDatabase.filter((b) => b.id !== id);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        // Next middleware
        next();
      });
    },
  };
}
