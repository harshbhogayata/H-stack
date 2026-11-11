import copy from '../copy/en.json';

export function StoryCard({ story, onOpen }) {
  return (
    <button type="button" className="story-card" onClick={() => onOpen(story.id)} aria-label={`${story.title}. ${copy.storyCard.seeds.replace('{n}', story.seeds)}`}>
      <img src={story.cover} alt="" />
      <span className="story-card__title">{story.title}</span>
      <span className="story-card__seeds">{copy.storyCard.seeds.replace('{n}', story.seeds)}</span>
    </button>
  );
}
