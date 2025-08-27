// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    await this.ctx.render('home.tpl', { name: 'egg' });
  }
}

module.exports = HomeController;
