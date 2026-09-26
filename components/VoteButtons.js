export default function VoteButtons({ targetType, targetId, likes, dislikes }) {
  return (
    <div className="vote">
      <form action="/api/vote" method="post">
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="value" value="1" />
        <button type="submit" title="Нравится">∆</button>
      </form>
      <span className="vote-count">{likes}</span>

      <form action="/api/vote" method="post">
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="value" value="-1" />
        <button type="submit" title="Не нравится">∇</button>
      </form>
      <span className="vote-count">{dislikes}</span>
    </div>
  );
}