<div align="center">
<a href="https://wechaty.js.org">
  <img src="https://github.com/wechaty/wechaty.js.org/blob/main/docs/images/wechaty-website.png" alt="wechaty official website" height ="auto" width="800" />
</a>
<br />
<h1>Wechaty Organization Website</h1>
<p>
Repository for the Wechaty Organization Website, a resource for the Wechaty Organization. It is the official Wechaty website for publishing latest news, blog posts, contributor profiles, and documentation from our open source community.
</p>
<p align="center">
<a href="https://github.com/wechaty/wechaty.js.org" alt="GitHub contributors">
<img src="https://img.shields.io/github/contributors/wechaty/wechaty.js.org.svg" /></a>
<a href="https://github.com/wechaty/wechaty.js.org" alt="GitHub issues by-label">
<img src="https://img.shields.io/github/issues/wechaty/wechaty.js.org" /></a>
<a href="https://gitter.im/wechaty/wechaty" alt="Gitter">
<img src="https://img.shields.io/badge/Gitter-@layer5.svg?logo=slack" /></a>
</p>

[![Wechaty Docusaurus](https://github.com/wechaty/docusaurus/workflows/Wechaty%20Docusaurus/badge.svg)](https://github.com/wechaty/wechaty.js.org/actions?query=workflow%3A%22Docusaurus%22)
[![Wechaty Jekyll](https://github.com/wechaty/jekyll/workflows/Wechaty%20Jekyll/badge.svg)](https://github.com/wechaty/wechaty.js.org/actions?query=workflow%3A%22Jekyll%22)

</div>

## Usage

```sh
docker-compose up
```

You are all set.

## Architecture

We are using Nginx as the front end proxy for serving the website traffic, from the below two locations:

1. Docusaurus Documentation <https://wechaty.github.io/docusaurus/>
1. Jekyll Posts <https://wechaty.github.io/jekyll/>

## Nginx Configuration

1. for `/docs` locations, proxy pass to <https://wechaty.github.io/> with a prefix `docusaurus` added to the path.
1. for `/{news,blogs,contributors,\d\d\d\d}` locations, proxy pass to <https://wechaty.github.io/> with a prefix `jekyll` added to the path.

Learn more from [nginx.conf](nginx.conf) and [docker-compose.yml](docker-compose.yml) files.

That's all.

## Author

[Huan LI](http://linkedin.com/in/zixia) is a serial entrepreneur, active angel investor with strong technology background.
Huan is a widely recognized technical leader on conversational AI and open source cloud architectures.
He co-authored guide books "Chatbot 0 to 1" and "Concise Handbook of TensorFlow 2"
and has been recognized both by Microsoft and Google as MVP/GDE.
Huan is a Chatbot Architect and speaks regularly at technical conferences around the world.
Find out more about his work at <https://github.com/huan>

## Copyright & License

- Docs released under Creative Commons
- Code released under the Apache-2.0 License
- Code & Docs © 2021 Huan LI \<zixia@zixia.net\>
