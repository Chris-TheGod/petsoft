import Branding from '@/components/branding';
import ContentBlock from '@/components/content-block';
import PetDetails from '@/components/pet-details';
import PetList from '@/components/pet-list';
import SearchForm from '@/components/search-form';
import Stats from '@/components/stats';

export default function Page() {
  return (
    <main>
      <div className='flex items-center justify-between text-white py-8'>
        <Branding />

        <Stats />
      </div>

      <div>
        <SearchForm />

        <ContentBlock>
          <PetList />
        </ContentBlock>

        <ContentBlock>
          <PetDetails />
        </ContentBlock>
      </div>
    </main>
  );
}
