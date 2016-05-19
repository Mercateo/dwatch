import expect from 'expect';
import { provideInstance, provideSingleton, kernel, inject } from '../../src/utils/IOC';

describe('IOC.ts', () => {
  beforeEach(() => {
    // kernel.snapshot();
  });

  describe('@provideInstance', () => {
    @provideInstance(InstanceClass)
    class InstanceClass {}

    @provideSingleton(SingletonClass)
    class SingletonClass {}

    it('should probably register an instance class', () => {

      let instance1 = kernel.get<InstanceClass>(InstanceClass);
      let instance2 = kernel.get<InstanceClass>(InstanceClass);

      expect(instance1).toBeTruthy();
      expect(instance2).toBeTruthy();

      expect(instance1).toNotBe(instance2);
    });
  });

  describe('@provideSingleton', () => {
    @provideInstance(InstanceClass)
    class InstanceClass {}

    @provideSingleton(SingletonClass)
    class SingletonClass {}

    it('should probably register a singleton', () => {

      let ref1 = kernel.get<SingletonClass>(SingletonClass);
      let ref2 = kernel.get<SingletonClass>(SingletonClass);

      expect(ref1).toBeTruthy();
      expect(ref2).toBeTruthy();

      expect(ref1).toBe(ref2);
    });
  });

  describe('@inject', () => {
    @provideInstance(InstanceClass)
    class InstanceClass {}

    @provideSingleton(SingletonClass)
    class SingletonClass {}

    class Service {
      @inject(InstanceClass)
      instanceClass: InstanceClass;

      @inject(SingletonClass)
      singletonClass: SingletonClass;
    }

    class ServiceWithDuplicatedInjects {
      @inject(InstanceClass)
      instanceClass: InstanceClass;

      @inject(SingletonClass)
      singletonClass: SingletonClass;

      @inject(InstanceClass)
      instanceClass2: InstanceClass;

      @inject(SingletonClass)
      singletonClass2: SingletonClass;
    }

    it('should probably inject instances', () => {
      const s = new Service();

      expect(s.instanceClass).toBeTruthy();
      expect(s.singletonClass).toBeTruthy();
      expect(s.singletonClass).toBe(s.singletonClass);
      expect(s.instanceClass).toBe(s.instanceClass);
    });

    it('should probably inject singletons', () => {
      const s = new Service();

      expect(s.singletonClass).toBe(kernel.get<SingletonClass>(SingletonClass));
    });

    it('should probably inject different instances and same singletons', () => {
      const s = new Service();
      const s2 = new Service();

      expect(s.instanceClass).toNotBe(s2.instanceClass);
      expect(s.singletonClass).toBe(s2.singletonClass);
    });

    it('should probably inject different instances and same singletons for duplicated targets', () => {
      const s = new ServiceWithDuplicatedInjects();
      const s2 = new ServiceWithDuplicatedInjects();

      expect(s.instanceClass).toBeTruthy();
      expect(s.singletonClass).toBeTruthy();
      expect(s.instanceClass2).toBeTruthy();
      expect(s.singletonClass2).toBeTruthy();
      expect(s.instanceClass).toBe(s.instanceClass);
      expect(s.singletonClass).toBe(s.singletonClass);
      expect(s.instanceClass2).toBe(s.instanceClass2);
      expect(s.singletonClass2).toBe(s.singletonClass2);

      expect(s2.instanceClass).toBeTruthy();
      expect(s2.singletonClass).toBeTruthy();
      expect(s2.instanceClass2).toBeTruthy();
      expect(s2.singletonClass2).toBeTruthy();
      expect(s2.instanceClass).toBe(s2.instanceClass);
      expect(s2.singletonClass).toBe(s2.singletonClass);
      expect(s2.instanceClass2).toBe(s2.instanceClass2);
      expect(s2.singletonClass2).toBe(s.singletonClass2);

      expect(s.instanceClass).toNotBe(s.instanceClass2);
      expect(s2.instanceClass).toNotBe(s2.instanceClass2);
      expect(s.instanceClass).toNotBe(s2.instanceClass2);
    });
  });

  afterEach(() => {
    // kernel.restore();
  });
});
