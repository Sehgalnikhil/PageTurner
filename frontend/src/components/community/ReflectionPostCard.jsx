import React, { useState } from 'react';
import {
  PiHeartBold,
  PiHeartFill,
  PiChatCircleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiShareNetworkBold,
  PiBookOpenBold,
  PiPaperPlaneRightBold,
  PiDotsThreeBold,
} from 'react-icons/pi';

const ReflectionPostCard = ({
  post,
  user,
  userAvatar,
  readerName,
  onLike,
  onBookmark,
  onShare,
  onAddComment,
  onOpenExcerpt,
  onEnterParlour,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id || post._id, commentText.trim());
    setCommentText('');
  };

  const isAuthorCurrentUser =
    post.author === readerName || post.author === user?.username || post.handle === user?.username;

  return (
    <article className="rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] p-5 sm:p-6 shadow-[0_2px_12px_rgba(50,34,29,0.03)] hover:border-[#B18A51]/40 transition-all text-left">
      {/* 1. Author Row & Associated Parlour */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <img
            src={
              isAuthorCurrentUser
                ? userAvatar
                : post.avatar || '/images/eleanor-avatar.jpg'
            }
            alt={post.author}
            className="w-10 h-10 rounded-full object-cover border border-[#E9DDCC] shadow-2xs flex-shrink-0"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-serif font-bold text-sm text-[#32221D]">
                {post.author}
              </span>
              <span className="text-xs text-[#827363]">
                @{post.handle}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#827363] mt-0.5 flex-wrap">
              <span>{post.time || 'Recently'}</span>
              <span>&bull;</span>
              <span>in</span>
              <button
                type="button"
                onClick={() => post.parlourSlug && onEnterParlour(post.parlourSlug)}
                className="font-medium text-[#812638] hover:underline cursor-pointer"
              >
                {post.parlourTitle || post.parlour || 'The Salon'}
              </button>
            </div>
          </div>
        </div>

        {/* Post Options / Share */}
        <button
          type="button"
          onClick={() => onShare(post)}
          className="p-1.5 text-[#827363] hover:text-[#32221D] rounded-full hover:bg-[#F7F2E9] transition-colors cursor-pointer"
          title="Share reflection link"
        >
          <PiShareNetworkBold className="text-sm" />
        </button>
      </div>

      {/* 2. Beautiful Letterpress Quotation Card (When present) */}
      {post.quote && (
        <div
          onClick={() => onOpenExcerpt && onOpenExcerpt(post)}
          className="my-3.5 p-4 rounded-xl bg-[#F7F2E9] border border-[#E9DDCC] hover:border-[#B18A51]/60 transition-all flex items-center justify-between gap-4 cursor-pointer group/quote"
          title="Click to read excerpt in full"
        >
          <div className="flex-1">
            <blockquote className="font-serif italic text-xs sm:text-[13.5px] text-[#32221D] leading-relaxed group-hover/quote:text-[#812638] transition-colors">
              {post.quote}
            </blockquote>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-serif text-[11.5px] text-[#827363]">
                — {post.quoteAuthor || 'Author'}
              </span>
              <span className="text-[11px] text-[#812638] font-semibold flex items-center gap-1 hover:underline">
                <PiBookOpenBold className="text-xs" />
                <span>Read Excerpt</span>
              </span>
            </div>
          </div>

          {post.quoteImg && (
            <div className="w-20 sm:w-24 h-16 rounded-lg overflow-hidden border border-[#E9DDCC] flex-shrink-0 shadow-2xs group-hover/quote:scale-104 transition-transform">
              <img
                src={post.quoteImg}
                alt="Book spread"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Reflection Narrative Text */}
      <p className="text-xs sm:text-[13px] text-[#32221D] leading-relaxed mb-4 font-sans">
        {post.content}
      </p>

      {/* 4. Action Controls Bar: Like, Comments, Bookmark, Share */}
      <div className="pt-3 border-t border-[#E9DDCC]/70 flex items-center justify-between text-xs text-[#827363]">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            type="button"
            onClick={() => onLike(post.id || post._id)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              post.liked ? 'text-[#812638] font-bold' : 'hover:text-[#812638]'
            }`}
          >
            {post.liked ? (
              <PiHeartFill className="text-sm text-[#812638] animate-jelly-pop" />
            ) : (
              <PiHeartBold className="text-sm" />
            )}
            <span>{post.likes || 0}</span>
          </button>

          {/* Comment Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComments ? 'text-[#812638] font-bold' : 'hover:text-[#32221D]'
            }`}
          >
            <PiChatCircleBold className="text-sm" />
            <span>{post.commentsCount || (post.commentsList?.length) || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Bookmark Ribbon */}
          <button
            type="button"
            onClick={() => onBookmark(post.id || post._id)}
            className="p-1 hover:text-[#812638] transition-colors cursor-pointer"
            title={post.bookmarked ? 'Saved to marginalia' : 'Save reflection'}
          >
            {post.bookmarked ? (
              <PiBookmarkSimpleFill className="text-sm text-[#812638]" />
            ) : (
              <PiBookmarkSimpleBold className="text-sm" />
            )}
          </button>
        </div>
      </div>

      {/* 5. Expandable Comment Thread (Fable-inspired clean social reading) */}
      {showComments && (
        <div className="mt-3.5 pt-3 border-t border-[#E9DDCC]/60 space-y-3">
          {/* Comments List */}
          {post.commentsList && post.commentsList.length > 0 ? (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {post.commentsList.map((c, idx) => (
                <div
                  key={c.id || c._id || idx}
                  className="p-2.5 rounded-xl bg-[#F7F2E9]/70 text-xs flex items-start gap-2.5"
                >
                  <img
                    src={c.avatar || '/images/eleanor-avatar.jpg'}
                    alt={c.author}
                    className="w-6 h-6 rounded-full object-cover border border-[#E9DDCC] flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-serif font-bold text-xs text-[#32221D]">
                        {c.author}
                      </span>
                      <span className="text-[10px] text-[#827363]">
                        {c.time || 'Recently'}
                      </span>
                    </div>
                    <p className="text-[#32221D] leading-snug font-sans">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#827363] italic font-serif">
              No marginalia inscribed yet. Be the first to share a thought.
            </p>
          )}

          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Inscribe a thoughtful response..."
              className="flex-1 px-3 py-2 rounded-full border border-[#E9DDCC] bg-[#FFFCF6] focus:bg-white text-xs text-[#32221D] focus:outline-none focus:border-[#812638] shadow-2xs"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-2 rounded-full bg-[#812638] hover:bg-[#6A1F2E] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <PiPaperPlaneRightBold className="text-xs" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default ReflectionPostCard;
