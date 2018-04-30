import '@toba/test';
import { MimeType, LinkRelation, htmlEscape } from '@toba/tools';
import {
   writeTag,
   writeTextTag,
   writeEntityTag,
   writeAttributes,
   writePerson,
   writeLink
} from './atom';
import { Link, Person, Entry, TextType } from './types';

const now = new Date();
const entry: Entry = {
   id: 'id',
   title: 'title',
   summary: {
      value: '<p>summary</p>',
      type: TextType.HTML
   },
   updated: now,
   published: now,
   contributor: null,
   content: 'content',
   link: {
      href: 'http://test.com'
   }
};

test('writes basic tags', () => {
   expect(writeTag('tag', 'value1')).toBe('<tag>value1</tag>');
   expect(writeTag('when', 'value2')).toBe(`<when>value2</when>`);
});

test('writes text tags', () => {
   expect(writeTextTag('summary', entry)).toBe(
      `<summary type="html">${htmlEscape('<p>summary</p>')}</summary>`
   );
   expect(writeTextTag('title', entry)).toBe(
      '<title type="text">title</title>'
   );
});

test('writes entity tags', () => {
   const p: Person = {
      name: 'Person One'
   };
   expect(writeEntityTag('name', p)).toBe('<name>Person One</name>');
   expect(writeEntityTag('updated', entry)).toBe(
      `<updated>${now.toISOString()}</updated>`
   );
});

test('writes attribute key-values', () => {
   const attr = new Map<string, string>([
      ['key1', 'value1'],
      ['key2', 'value2']
   ]);
   expect(writeAttributes(attr)).toBe(' key1="value1" key2="value2"');
   expect(writeAttributes(null)).toBe('');
});

test('writes person', () => {
   const person1: Person = { name: 'Person' };
   const person2: Person = { name: 'Bob', email: 'bob@test.com' };
   const expect1 = '<author><name>Person</name></author>';
   const expect2 =
      '<author><name>Bob</name><email>bob@test.com</email></author>';

   expect(writePerson('author', person1)).toBe(expect1);
   expect(writePerson('author', person2)).toBe(expect2);
   expect(writePerson('author', [person1, person2])).toBe(expect1 + expect2);
});

test('writes link', () => {
   const href = 'http://www.test.com';
   const link1: Link = {
      href,
      rel: LinkRelation.Alternate
   };
   const link2: Link = {
      href,
      type: MimeType.Atom,
      rel: LinkRelation.Enclosure
   };
   const expect1 = `<link href="${href}" rel="${LinkRelation.Alternate}"/>`;
   const expect2 = `<link href="${href}" rel="${
      LinkRelation.Enclosure
   }" type="${MimeType.Atom}"/>`;

   expect(writeLink(link1)).toBe(expect1);
   expect(writeLink(link2)).toBe(expect2);
   expect(writeLink([link1, link2])).toBe(expect1 + expect2);
});
