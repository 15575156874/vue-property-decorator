import * as Vue from 'vue'
import * as assert from 'power-assert'
import Component from 'vue-class-component'
import { Prop, Watch } from '../src/vue-property-decorator'
import { Prop as PropWithMetadata } from '../src/metadata'

describe('prop decorator', () => {
  it('should add props to "props" property', () => {
    @Component
    class Test extends Vue {

      @Prop(Number)
      propA: number

      @Prop({ type: String, default: 'propB' })
      propB: string

      @Prop([Boolean, String])
      propC: boolean | string

      @Prop()
      propD: any
    }

    const { $options } = new Test()
    const { props } = $options
    if (!(props instanceof Array)) {
      assert.deepEqual(props!['propA'], { type: Number })
      assert.deepEqual(props!['propB'], { type: String, default: 'propB' })
      assert.deepEqual(props!['propC'], { type: [Boolean, String] })
      assert.deepEqual(props!['propD'], { type: null })
    }

    const test = new Test({ propsData: { propA: 10 } })
    assert.equal(test.propA, 10)
    assert.equal(test.propB, 'propB')
  })
})

describe('prop decorator with metadata', () => {
  it('should add props to "props" property', () => {
    @Component
    class Test extends Vue {
      @PropWithMetadata()
      propA: number

      @PropWithMetadata({ default: 'propB' })
      propB: string

      @PropWithMetadata([Boolean, String])
      propC: boolean | string

      @Prop({ type: null })
      propD: any
    }

    const { $options } = new Test()
    const { props } = $options
    if (!(props instanceof Array)) {
      assert.deepEqual(props!['propA'], { type: Number })
      assert.deepEqual(props!['propB'], { type: String, default: 'propB' })
      assert.deepEqual(props!['propC'], { type: [Boolean, String] })
      assert.deepEqual(props!['propD'], { type: null })
    }

    const test = new Test({ propsData: { propA: 10 } })
    assert.equal(test.propA, 10)
    assert.equal(test.propB, 'propB')
  })
})

describe('watch decorator', () => {
  it('should add expressions to "watch" property', () => {

    let num = 0

    @Component
    class Test extends Vue {
      moreExpression = false

      @Watch('expression')
      @Watch('moreExpression', { immediate: true })
      method() {
        num = 1
      }
    }

    const { $options } = new Test()
    assert.equal(($options.watch!['expression'] as any).handler, 'method')
    assert.equal(($options.watch!['moreExpression'] as any).immediate, true)

    const test = new Test()

    test.moreExpression = true

    assert.equal(num, 1)
  })
})
