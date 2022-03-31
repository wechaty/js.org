# wechaty.js.org

Wechaty Official Website for News, Blogs, Contributor Profiles, and Documentations.

- <https://wechaty.js.org>

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
