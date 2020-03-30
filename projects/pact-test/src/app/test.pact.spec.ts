import { HttpClientModule } from '@angular/common/http';
import { TestService } from './test.service';
import { TestBed } from '@angular/core/testing';
import { PactWeb, Interaction } from '@pact-foundation/pact-web';

describe('should test basic interaction', () => {
  let provider: PactWeb;
  let service: TestService;

  beforeEach(async () => {
    provider = new PactWeb({
      consumer: 'test',
      provider: 'test',
      port: 1234,
      cors: true
    });
    const interaction = new Interaction();
    await provider.addInteraction(interaction);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TestService]
    });
    service = TestBed.inject(TestService);
  });

  it('should work', done => {
    service.getData().subscribe(data => {
      expect(data).toEqual({
        posts: [{ id: 1, title: 'json-server', author: 'typicode' }]
      });
      done();
    });
  });

  afterEach(async () => await provider.verify());
  afterAll(async () => await provider.finalize());
});
