import { formatDate, topFour } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY, STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react'
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupTypeCard } from '@/components/StartupCard';

const md = markdownit();

export const experimental_ppr = true;



const page = async ({ params }: { params: Promise<{ id: string}>}) => {
  const id = (await params).id;

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  const authorPosts = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id: post.author?._id });

  let topPosts = topFour(authorPosts);
  topPosts = topPosts.filter((post: StartupTypeCard) => post._id !== id);

  const content = md.render(post?.pitch || "");
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
        <p className='sub-heading !max-w-5xl'>{post.description}</p>
      </section>

      <section className="section_container">
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt="thumbnail" className='w-full h-auto rounded-xl' />
          <div className="flex-between gap-5">
            <Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
              <Image src={post.author?.image} alt="author" width={64} height={64} className='rounded-full drop-shadow-lg' />
              
              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pith Details</h3>

          {content? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p>No pitch details</p>
          )}
        </div>

        <hr className="divider" />
        
        {topPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">{"Authos' Top Startups"}</p>

            <ul className="mt-7 card_grid-sm">
              {topPosts.map((post: StartupTypeCard, i: number) => {
                return <StartupCard key={i} post={post} />
              })}
            </ul>
          </div>
        )}
        
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  )
}

export default page