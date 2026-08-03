import type { BoardMember } from '../../types/board';

export default function BoardDashboard({ member }: { member: BoardMember }) {
  return (
    <div className="deck-page min-h-screen flex items-center justify-center">
      <p className="deck-lede">Velkommen, {member.full_name}. Innhold kommer.</p>
    </div>
  );
}
